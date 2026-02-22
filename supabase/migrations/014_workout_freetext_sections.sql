-- Isınma ve Kardiyo-Metcon serbest metin alanları
ALTER TABLE workouts
ADD COLUMN warmup_text text,
ADD COLUMN cardio_text text;
