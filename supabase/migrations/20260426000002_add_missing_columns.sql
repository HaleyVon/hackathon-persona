-- 원본 Nemotron-Personas-Korea 누락 컬럼 추가 + raw JSONB에서 backfill

ALTER TABLE personas
  ADD COLUMN IF NOT EXISTS uuid                    TEXT,
  ADD COLUMN IF NOT EXISTS sports_persona          TEXT,
  ADD COLUMN IF NOT EXISTS arts_persona            TEXT,
  ADD COLUMN IF NOT EXISTS travel_persona          TEXT,
  ADD COLUMN IF NOT EXISTS culinary_persona        TEXT,
  ADD COLUMN IF NOT EXISTS cultural_background     TEXT,
  ADD COLUMN IF NOT EXISTS skills_and_expertise    TEXT,
  ADD COLUMN IF NOT EXISTS skills_and_expertise_list TEXT,
  ADD COLUMN IF NOT EXISTS hobbies_and_interests_list TEXT,
  ADD COLUMN IF NOT EXISTS marital_status          TEXT,
  ADD COLUMN IF NOT EXISTS military_status         TEXT,
  ADD COLUMN IF NOT EXISTS family_type             TEXT,
  ADD COLUMN IF NOT EXISTS housing_type            TEXT,
  ADD COLUMN IF NOT EXISTS bachelors_field         TEXT,
  ADD COLUMN IF NOT EXISTS district                TEXT,
  ADD COLUMN IF NOT EXISTS country                 TEXT;

-- raw JSONB에서 backfill
UPDATE personas SET
  uuid                      = raw->>'uuid',
  sports_persona            = raw->>'sports_persona',
  arts_persona              = raw->>'arts_persona',
  travel_persona            = raw->>'travel_persona',
  culinary_persona          = raw->>'culinary_persona',
  cultural_background       = raw->>'cultural_background',
  skills_and_expertise      = raw->>'skills_and_expertise',
  skills_and_expertise_list = raw->>'skills_and_expertise_list',
  hobbies_and_interests_list= raw->>'hobbies_and_interests_list',
  marital_status            = raw->>'marital_status',
  military_status           = raw->>'military_status',
  family_type               = raw->>'family_type',
  housing_type              = raw->>'housing_type',
  bachelors_field           = raw->>'bachelors_field',
  district                  = raw->>'district',
  country                   = raw->>'country';

-- district 인덱스 추가 (province보다 세분화된 지역 필터 가능)
CREATE INDEX IF NOT EXISTS idx_personas_district ON personas (district);
