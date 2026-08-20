CREATE TABLE question_bank_versions (
    id BIGSERIAL PRIMARY KEY,
    bank_code VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    question_count INT NOT NULL,
    critical_question_count INT NOT NULL DEFAULT 0,
    source VARCHAR(255),
    effective_from DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_question_bank_versions_bank_code_version UNIQUE (bank_code, version),
    CONSTRAINT chk_question_bank_versions_bank_code_not_blank CHECK (LENGTH(BTRIM(bank_code)) > 0),
    CONSTRAINT chk_question_bank_versions_version_not_blank CHECK (LENGTH(BTRIM(version)) > 0),
    CONSTRAINT chk_question_bank_versions_question_count_positive CHECK (question_count > 0),
    CONSTRAINT chk_question_bank_versions_critical_count_non_negative CHECK (critical_question_count >= 0),
    CONSTRAINT chk_question_bank_versions_counts_consistent CHECK (question_count >= critical_question_count)
);

INSERT INTO question_bank_versions (
    id,
    bank_code,
    version,
    question_count,
    critical_question_count,
    source,
    effective_from,
    is_active
) VALUES (
    1,
    'CSGT-600-2025',
    '2025.06',
    600,
    60,
    'Cuc Canh sat giao thong',
    DATE '2025-06-01',
    TRUE
);

SELECT setval(pg_get_serial_sequence('question_bank_versions', 'id'), 1, true);

ALTER TABLE chapters
    ADD COLUMN question_bank_version_id BIGINT NOT NULL DEFAULT 1 REFERENCES question_bank_versions(id) ON DELETE RESTRICT;

ALTER TABLE questions
    ADD COLUMN question_bank_version_id BIGINT NOT NULL DEFAULT 1 REFERENCES question_bank_versions(id) ON DELETE RESTRICT;

ALTER TABLE chapters DROP CONSTRAINT IF EXISTS chapters_code_key;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_question_number_key;

ALTER TABLE chapters
    ADD CONSTRAINT uq_chapters_bank_code UNIQUE (question_bank_version_id, code);

ALTER TABLE questions
    ADD CONSTRAINT uq_questions_bank_number UNIQUE (question_bank_version_id, question_number);

CREATE INDEX idx_chapters_question_bank_version_id ON chapters(question_bank_version_id);
CREATE INDEX idx_questions_question_bank_version_id ON questions(question_bank_version_id);

CREATE TABLE license_exam_profiles (
    id BIGSERIAL PRIMARY KEY,
    question_bank_version_id BIGINT NOT NULL DEFAULT 1 REFERENCES question_bank_versions(id) ON DELETE RESTRICT,
    profile_code VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    question_count INT NOT NULL,
    duration_minutes INT NOT NULL,
    passing_score INT NOT NULL,
    critical_fail_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_license_exam_profiles_version_code UNIQUE (question_bank_version_id, profile_code),
    CONSTRAINT chk_license_exam_profiles_profile_code_not_blank CHECK (LENGTH(BTRIM(profile_code)) > 0),
    CONSTRAINT chk_license_exam_profiles_display_name_not_blank CHECK (LENGTH(BTRIM(display_name)) > 0),
    CONSTRAINT chk_license_exam_profiles_question_count_positive CHECK (question_count > 0),
    CONSTRAINT chk_license_exam_profiles_duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT chk_license_exam_profiles_passing_score_non_negative CHECK (passing_score >= 0),
    CONSTRAINT chk_license_exam_profiles_passing_score_within_total CHECK (passing_score <= question_count)
);

CREATE INDEX idx_license_exam_profiles_version_id ON license_exam_profiles(question_bank_version_id);
CREATE INDEX idx_license_exam_profiles_is_active ON license_exam_profiles(is_active);

CREATE TABLE practice_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    selected_answer_id BIGINT NOT NULL REFERENCES answers(id) ON DELETE RESTRICT,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_practice_attempts_user_id ON practice_attempts(user_id);
CREATE INDEX idx_practice_attempts_question_id ON practice_attempts(question_id);
CREATE INDEX idx_practice_attempts_selected_answer_id ON practice_attempts(selected_answer_id);

ALTER TABLE exam_sessions
    ADD COLUMN license_exam_profile_id BIGINT REFERENCES license_exam_profiles(id) ON DELETE SET NULL,
    ADD COLUMN state VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    ADD COLUMN expires_at TIMESTAMP;

ALTER TABLE exam_sessions
    ADD CONSTRAINT chk_exam_sessions_state CHECK (state IN ('CREATED', 'IN_PROGRESS', 'SUBMITTED', 'EXPIRED')),
    ADD CONSTRAINT chk_exam_sessions_expires_after_started CHECK (expires_at IS NULL OR expires_at >= started_at);

CREATE INDEX idx_exam_sessions_license_exam_profile_id ON exam_sessions(license_exam_profile_id);
CREATE INDEX idx_exam_sessions_state ON exam_sessions(state);
