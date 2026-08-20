ALTER TABLE exam_sessions DROP CONSTRAINT IF EXISTS chk_exam_sessions_license_type;

ALTER TABLE exam_sessions
    ADD CONSTRAINT chk_exam_sessions_license_type_not_blank CHECK (LENGTH(BTRIM(license_type)) > 0);

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
VALUES
    (1, 'A1', 'GPLX A1', 25, 19, 21, TRUE, 1, TRUE),
    (1, 'A', 'GPLX A', 25, 19, 23, TRUE, 1, TRUE),
    (1, 'B', 'GPLX B', 30, 20, 27, TRUE, 1, TRUE),
    (1, 'C1', 'GPLX C1', 35, 22, 32, TRUE, 1, TRUE),
    (1, 'C', 'GPLX C', 40, 24, 36, TRUE, 1, TRUE),
    (1, 'D1', 'GPLX D1', 45, 26, 40, TRUE, 1, TRUE),
    (1, 'D2', 'GPLX D2', 45, 26, 40, TRUE, 1, TRUE),
    (1, 'D', 'GPLX D', 45, 26, 42, TRUE, 1, TRUE),
    (1, 'BE', 'GPLX BE', 45, 26, 40, TRUE, 1, TRUE),
    (1, 'C1E', 'GPLX C1E', 45, 26, 40, TRUE, 1, TRUE),
    (1, 'CE', 'GPLX CE', 45, 26, 42, TRUE, 1, TRUE),
    (1, 'D1E', 'GPLX D1E', 45, 26, 42, TRUE, 1, TRUE),
    (1, 'D2E', 'GPLX D2E', 45, 26, 42, TRUE, 1, TRUE),
    (1, 'DE', 'GPLX DE', 45, 26, 42, TRUE, 1, TRUE)
ON CONFLICT (question_bank_version_id, profile_code)
DO UPDATE SET
    display_name = EXCLUDED.display_name,
    question_count = EXCLUDED.question_count,
    duration_minutes = EXCLUDED.duration_minutes,
    passing_score = EXCLUDED.passing_score,
    critical_fail_enabled = EXCLUDED.critical_fail_enabled,
    critical_question_count = EXCLUDED.critical_question_count,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
