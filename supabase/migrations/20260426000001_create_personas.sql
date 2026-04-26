-- Persona Signal: Nemotron-Personas-Korea 테이블
-- 모든 필드 보존 + 필터링 인덱스

CREATE TABLE IF NOT EXISTS personas (
  id BIGSERIAL PRIMARY KEY,

  -- 필터링 컬럼 (인덱스)
  sex             TEXT,
  age             INTEGER,
  occupation      TEXT,
  province        TEXT,
  education_level TEXT,

  -- 자연어 페르소나 필드
  persona                       TEXT,
  professional_persona          TEXT,
  family_persona                TEXT,
  hobbies_and_interests         TEXT,
  career_goals_and_ambitions    TEXT,

  -- 원본 row 전체 보존 (알 수 없는 필드 포함)
  raw JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 필터링 성능 인덱스
CREATE INDEX IF NOT EXISTS idx_personas_age      ON personas (age);
CREATE INDEX IF NOT EXISTS idx_personas_sex      ON personas (sex);
CREATE INDEX IF NOT EXISTS idx_personas_occ      ON personas (occupation);
CREATE INDEX IF NOT EXISTS idx_personas_province ON personas (province);

-- 복합 인덱스 (가장 많이 쓸 조합)
CREATE INDEX IF NOT EXISTS idx_personas_age_sex  ON personas (age, sex);
CREATE INDEX IF NOT EXISTS idx_personas_demo     ON personas (sex, age, occupation, province);

-- RLS 비활성화 (해커톤 MVP - 인증 없음)
ALTER TABLE personas DISABLE ROW LEVEL SECURITY;
