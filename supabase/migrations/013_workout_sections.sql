-- Egzersizlere bölüm (section) alanı ekle
ALTER TABLE workout_exercises
ADD COLUMN section text NOT NULL DEFAULT 'strength'
CHECK (section IN ('warmup', 'strength', 'accessory', 'cardio'));
