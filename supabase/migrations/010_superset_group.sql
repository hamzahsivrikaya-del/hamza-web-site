-- Superset desteği: aynı superset_group numarasındaki egzersizler birlikte yapılır
ALTER TABLE workout_exercises ADD COLUMN superset_group smallint;
