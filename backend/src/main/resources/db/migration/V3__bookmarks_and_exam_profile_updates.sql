CREATE TABLE bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bookmarks_user_question UNIQUE (user_id, question_id)
);

INSERT INTO bookmarks (user_id, question_id, created_at, updated_at)
SELECT user_id, question_id, created_at, updated_at
FROM user_question_progress
WHERE is_bookmarked = TRUE;

DROP INDEX IF EXISTS idx_progress_user_bookmarked;
ALTER TABLE user_question_progress DROP COLUMN IF EXISTS is_bookmarked;

ALTER TABLE license_exam_profiles
    ADD COLUMN critical_question_count INT NOT NULL DEFAULT 1,
    ADD CONSTRAINT chk_license_exam_profiles_critical_count_non_negative CHECK (critical_question_count >= 0),
    ADD CONSTRAINT chk_license_exam_profiles_critical_count_within_total CHECK (critical_question_count <= question_count);

ALTER TABLE exam_sessions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE exam_session_answers ALTER COLUMN is_correct DROP NOT NULL;

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_question_id ON bookmarks(question_id);

INSERT INTO license_exam_profiles (
    question_bank_version_id,
    profile_code,
    display_name,
    question_count,
    duration_minutes,
    passing_score,
    critical_fail_enabled,
    critical_question_count,
    is_active
)
SELECT 1, 'A1', 'GPLX A1', 25, 19, 21, TRUE, 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM license_exam_profiles WHERE question_bank_version_id = 1 AND profile_code = 'A1'
);

INSERT INTO license_exam_profiles (
    question_bank_version_id,
    profile_code,
    display_name,
    question_count,
    duration_minutes,
    passing_score,
    critical_fail_enabled,
    critical_question_count,
    is_active
)
SELECT 1, 'B', 'GPLX B', 30, 20, 27, TRUE, 1, TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM license_exam_profiles WHERE question_bank_version_id = 1 AND profile_code = 'B'
);
