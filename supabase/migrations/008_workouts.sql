-- workouts tablosu
CREATE TABLE public.workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('public', 'member')),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  day_index smallint NOT NULL CHECK (day_index BETWEEN 0 AND 6),
  title text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

-- workout_exercises tablosu
CREATE TABLE public.workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  order_num smallint NOT NULL DEFAULT 0,
  name text NOT NULL,
  sets smallint,
  reps text,
  weight text,
  rest text,
  notes text
);

-- Indexler
CREATE INDEX idx_workouts_type_week ON public.workouts(type, week_start);
CREATE INDEX idx_workouts_user ON public.workouts(user_id) WHERE user_id IS NOT NULL;

-- Public antrenmanlar icin unique: ayni hafta+gun+public bir tane olabilir
CREATE UNIQUE INDEX idx_workouts_public_unique ON public.workouts(week_start, day_index) WHERE type = 'public';

-- RLS
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Admin her seyi gorebilir
CREATE POLICY "admin_all_workouts" ON public.workouts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Uye: public + kendine ait olanlari gorebilir
CREATE POLICY "member_read_workouts" ON public.workouts FOR SELECT
  USING (type = 'public' OR user_id = auth.uid());

-- Exercises: workout'a erisimi olan herkes
CREATE POLICY "admin_all_exercises" ON public.workout_exercises FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "member_read_exercises" ON public.workout_exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workouts w
    WHERE w.id = workout_id AND (w.type = 'public' OR w.user_id = auth.uid())
  ));

-- Anon (landing page): sadece public
CREATE POLICY "anon_read_public_workouts" ON public.workouts FOR SELECT TO anon
  USING (type = 'public');

CREATE POLICY "anon_read_public_exercises" ON public.workout_exercises FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.type = 'public'
  ));
