-- Admin'in üyelere bırakacağı genel beslenme notu
ALTER TABLE users ADD COLUMN IF NOT EXISTS nutrition_note TEXT;
