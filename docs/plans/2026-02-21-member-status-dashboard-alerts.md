# Üye Durum Yönetimi ve Dashboard Uyarıları

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Admin dashboard'da paket uyarılarını (son 2 ders, son 1 ders, paket bitti) göstermek, paket bittiğinde üyeyi otomatik pasife almak ve admin'in üyeyi manuel olarak aktif/pasif yapabilmesini kolaylaştırmak.

**Architecture:** Mevcut trigger (`update_package_used_lessons`) zaten paket `status`'unu `completed` yapıyor ama `is_active`'i değiştirmiyor. Yeni bir trigger eklenecek: paket `completed` olduğunda üyenin başka aktif paketi yoksa `is_active = false` yapacak. Dashboard'daki uyarı kartı genişletilip 3 seviye (son 2, son 1, bitti) gösterecek. MemberDetail'deki düzenleme modal'ında Aktif/Pasif toggle zaten var ama checkbox olarak gizli kalmış — bunu daha belirgin bir toggle/switch yapacağız.

**Tech Stack:** Supabase PostgreSQL trigger, Next.js server component, Tailwind CSS

---

### Task 1: DB Trigger — Paket bitince üyeyi pasife al

**Files:**
- Create: `supabase/migrations/012_auto_deactivate_member.sql`

**Step 1: Migration dosyasını oluştur**

```sql
-- Paket completed olduğunda, üyenin başka aktif paketi yoksa is_active = false yap
CREATE OR REPLACE FUNCTION auto_deactivate_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Sadece status 'completed' olduğunda çalış
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Üyenin başka aktif paketi var mı kontrol et
    IF NOT EXISTS (
      SELECT 1 FROM public.packages
      WHERE user_id = NEW.user_id
        AND status = 'active'
        AND id != NEW.id
    ) THEN
      UPDATE public.users
      SET is_active = false
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_deactivate_member
  AFTER UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION auto_deactivate_member();
```

**Step 2: Migration'ı Supabase'e uygula**

REST API ile doğrudan uygulanamaz. SQL'i Supabase Dashboard → SQL Editor'den çalıştır, veya service_role key ile storage gibi bir workaround kullan.

Alternatif: Trigger yerine uygulama seviyesinde (ders eklendiğinde JS tarafında kontrol) yapılabilir. Ama trigger daha güvenilir.

**Step 3: Commit**

```bash
git add supabase/migrations/012_auto_deactivate_member.sql
git commit -m "feat: paket bitince üyeyi otomatik pasife alan trigger (migration 012)"
```

---

### Task 2: Admin Dashboard — Uyarı kartını 3 seviyeye genişlet

**Files:**
- Modify: `src/app/(admin)/admin/page.tsx`

**Step 1: Uyarı kartı mantığını güncelle**

Mevcut filtre `remaining > 0 && remaining <= 2` — buna `remaining === 0` (paket bitti) eklenecek. Kart başlığı "Paket Uyarıları" olacak. 3 seviye:

- `remaining === 0` → "Paket Bitti" (danger, kırmızı)
- `remaining === 1` → "Son 1 Ders" (danger, kırmızı)
- `remaining === 2` → "Son 2 Ders" (warning, sarı)

Değişiklikler:

1. `lowLessonMembers` filtresini genişlet: `remaining <= 2` (0 dahil)
2. Kart başlığını "Paket Uyarıları" yap
3. Badge variant'ını remaining'e göre ayarla
4. remaining === 0 için "Paket Bitti" yazısı

```tsx
// Filtre güncelle — 0 dahil (paket bitti)
const alertMembers = (lowLessonMembers_raw || [])
  .filter((pkg) => (pkg.total_lessons - pkg.used_lessons) <= 2)
  .sort((a, b) => (a.total_lessons - a.used_lessons) - (b.total_lessons - b.used_lessons))
```

Kart içi JSX:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Paket Uyarıları</CardTitle>
  </CardHeader>
  {alertMembers.length > 0 ? (
    <ul className="space-y-2">
      {alertMembers.map((pkg) => {
        const remaining = pkg.total_lessons - pkg.used_lessons
        return (
          <li key={pkg.user_id} className="flex items-center justify-between">
            <Link href={`/admin/members/${pkg.user_id}`} className="text-sm hover:text-primary transition-colors">
              {pkg.users?.full_name}
            </Link>
            <Badge variant={remaining <= 0 ? 'danger' : remaining === 1 ? 'danger' : 'warning'}>
              {remaining <= 0 ? 'Paket Bitti' : remaining === 1 ? 'Son 1 Ders' : 'Son 2 Ders'}
            </Badge>
          </li>
        )
      })}
    </ul>
  ) : (
    <p className="text-sm text-text-secondary">Uyarı yok</p>
  )}
</Card>
```

**Step 2: TypeScript kontrol**

Run: `npx tsc --noEmit`
Expected: Hata yok

**Step 3: Commit**

```bash
git add src/app/(admin)/admin/page.tsx
git commit -m "feat: admin dashboard paket uyarıları — son 2, son 1, bitti seviyeleri"
```

---

### Task 3: MemberDetail — Aktif/Pasif toggle'ı belirginleştir

**Files:**
- Modify: `src/app/(admin)/admin/members/[id]/MemberDetail.tsx`

**Step 1: Düzenleme modal'daki checkbox'ı belirgin toggle'a çevir**

Mevcut: gizli checkbox (`is_active`)
Yeni: Belirgin bir toggle switch, renkli arka plan ile

Düzenleme modal'ındaki bu kısmı:
```tsx
<div className="flex items-center gap-2">
  <input type="checkbox" id="is_active" checked={editForm.is_active} ... />
  <label htmlFor="is_active" className="text-sm">Aktif üye</label>
</div>
```

Şununla değiştir:
```tsx
<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
  <div>
    <p className="text-sm font-medium text-text-primary">Üye Durumu</p>
    <p className="text-xs text-text-secondary mt-0.5">
      {editForm.is_active ? 'Üye aktif — giriş yapabilir' : 'Üye pasif — giriş yapamaz'}
    </p>
  </div>
  <button
    type="button"
    onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
      editForm.is_active ? 'bg-green-500' : 'bg-border'
    }`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
      editForm.is_active ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </button>
</div>
```

**Step 2: Ayrıca hero bölümünde Aktif/Pasif badge'inin yanına hızlı toggle butonu ekle**

Üye kimliği bölümünde badge'in yanına küçük bir toggle ikon butonu ekle — tek tıkla aktif/pasif değiştirme.

**Step 3: TypeScript kontrol**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/(admin)/admin/members/[id]/MemberDetail.tsx
git commit -m "feat: üye aktif/pasif toggle switch — belirgin UI + tek tıkla değiştirme"
```

---

### Task 4: Yeni paket eklendiğinde üyeyi otomatik aktife al

**Files:**
- Modify: `supabase/migrations/012_auto_deactivate_member.sql` (aynı migration'a ekle)

**Step 1: Trigger'ı genişlet — yeni paket eklendiğinde is_active = true**

Migration'a INSERT trigger ekle:

```sql
-- Yeni paket eklendiğinde üyeyi aktife al
CREATE OR REPLACE FUNCTION auto_activate_on_new_package()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE public.users
    SET is_active = true
    WHERE id = NEW.user_id AND is_active = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_activate_on_new_package
  AFTER INSERT ON public.packages
  FOR EACH ROW EXECUTE FUNCTION auto_activate_on_new_package();
```

**Step 2: Commit**

```bash
git add supabase/migrations/012_auto_deactivate_member.sql
git commit -m "feat: yeni paket eklendiğinde üyeyi otomatik aktife alan trigger"
```

---

## Özet

| Task | Dosya | Açıklama |
|------|-------|----------|
| 1 | `012_auto_deactivate_member.sql` | Paket bitince üyeyi pasife al (trigger) |
| 2 | `admin/page.tsx` | Dashboard uyarı kartı — 3 seviye |
| 3 | `MemberDetail.tsx` | Aktif/Pasif toggle switch |
| 4 | `012_auto_deactivate_member.sql` | Yeni paket → üyeyi aktife al (trigger) |
