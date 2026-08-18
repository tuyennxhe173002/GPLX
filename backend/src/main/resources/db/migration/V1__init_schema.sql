CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_chapters_code_not_blank CHECK (LENGTH(BTRIM(code)) > 0),
    CONSTRAINT chk_chapters_name_not_blank CHECK (LENGTH(BTRIM(name)) > 0),
    CONSTRAINT chk_chapters_sort_order_positive CHECK (sort_order > 0)
);

CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL REFERENCES chapters(id) ON DELETE RESTRICT,
    question_number INT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image_url TEXT,
    question_type VARCHAR(50) NOT NULL,
    explanation TEXT,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    has_animation BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_questions_number_range CHECK (question_number BETWEEN 1 AND 600),
    CONSTRAINT chk_questions_content_not_blank CHECK (LENGTH(BTRIM(content)) > 0),
    CONSTRAINT chk_questions_type CHECK (question_type IN ('TEXT', 'IMAGE', 'TRAFFIC_SCENE', 'SIGN'))
);

CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    label VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_answers_label_not_blank CHECK (LENGTH(BTRIM(label)) > 0),
    CONSTRAINT chk_answers_content_not_blank CHECK (LENGTH(BTRIM(content)) > 0),
    CONSTRAINT chk_answers_sort_order_positive CHECK (sort_order > 0),
    CONSTRAINT uq_answers_question_label UNIQUE (question_id, label),
    CONSTRAINT uq_answers_question_sort_order UNIQUE (question_id, sort_order)
);

CREATE TABLE explanation_animations (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
    scene_width INT NOT NULL,
    scene_height INT NOT NULL,
    background_image_url TEXT,
    duration_ms INT NOT NULL,
    animation_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_animations_scene_width_positive CHECK (scene_width > 0),
    CONSTRAINT chk_animations_scene_height_positive CHECK (scene_height > 0),
    CONSTRAINT chk_animations_duration_positive CHECK (duration_ms > 0),
    CONSTRAINT chk_animations_data_is_object CHECK (jsonb_typeof(animation_data) = 'object')
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_email_not_blank CHECK (LENGTH(BTRIM(email)) > 0),
    CONSTRAINT chk_users_password_hash_not_blank CHECK (LENGTH(BTRIM(password_hash)) > 0)
);

CREATE TABLE user_question_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    total_attempts INT NOT NULL DEFAULT 0,
    correct_attempts INT NOT NULL DEFAULT 0,
    wrong_attempts INT NOT NULL DEFAULT 0,
    last_selected_answer_id BIGINT REFERENCES answers(id) ON DELETE SET NULL,
    last_is_correct BOOLEAN,
    is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_question_progress_user_question UNIQUE (user_id, question_id),
    CONSTRAINT chk_progress_total_attempts_non_negative CHECK (total_attempts >= 0),
    CONSTRAINT chk_progress_correct_attempts_non_negative CHECK (correct_attempts >= 0),
    CONSTRAINT chk_progress_wrong_attempts_non_negative CHECK (wrong_attempts >= 0),
    CONSTRAINT chk_progress_attempts_consistent CHECK (total_attempts >= correct_attempts + wrong_attempts)
);

CREATE TABLE exam_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_type VARCHAR(20) NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL DEFAULT 0,
    wrong_count INT NOT NULL DEFAULT 0,
    critical_wrong_count INT NOT NULL DEFAULT 0,
    is_passed BOOLEAN,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_exam_sessions_license_type CHECK (license_type IN ('A1', 'A2', 'B1', 'B2', 'C', 'D', 'E', 'F')),
    CONSTRAINT chk_exam_sessions_total_questions_positive CHECK (total_questions > 0),
    CONSTRAINT chk_exam_sessions_correct_count_non_negative CHECK (correct_count >= 0),
    CONSTRAINT chk_exam_sessions_wrong_count_non_negative CHECK (wrong_count >= 0),
    CONSTRAINT chk_exam_sessions_critical_wrong_count_non_negative CHECK (critical_wrong_count >= 0),
    CONSTRAINT chk_exam_sessions_counts_within_total CHECK (correct_count + wrong_count <= total_questions),
    CONSTRAINT chk_exam_sessions_finished_after_started CHECK (finished_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE exam_session_questions (
    id BIGSERIAL PRIMARY KEY,
    exam_session_id BIGINT NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    sort_order INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_exam_session_questions_session_question UNIQUE (exam_session_id, question_id),
    CONSTRAINT uq_exam_session_questions_session_sort_order UNIQUE (exam_session_id, sort_order),
    CONSTRAINT chk_exam_session_questions_sort_order_positive CHECK (sort_order > 0)
);

CREATE TABLE exam_session_answers (
    id BIGSERIAL PRIMARY KEY,
    exam_session_id BIGINT NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    selected_answer_id BIGINT REFERENCES answers(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_exam_session_answers_session_question UNIQUE (exam_session_id, question_id)
);

CREATE INDEX idx_chapters_sort_order ON chapters(sort_order);

CREATE INDEX idx_questions_chapter_id ON questions(chapter_id);
CREATE INDEX idx_questions_question_number ON questions(question_number);
CREATE INDEX idx_questions_is_critical ON questions(is_critical);
CREATE INDEX idx_questions_question_type ON questions(question_type);
CREATE INDEX idx_questions_has_animation ON questions(has_animation);

CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE UNIQUE INDEX uq_answers_one_correct_per_question ON answers(question_id) WHERE is_correct = TRUE;

CREATE INDEX idx_explanation_animations_question_id ON explanation_animations(question_id);

CREATE INDEX idx_users_email_lower ON users(LOWER(email));

CREATE INDEX idx_progress_user_id ON user_question_progress(user_id);
CREATE INDEX idx_progress_question_id ON user_question_progress(question_id);
CREATE INDEX idx_progress_user_wrong ON user_question_progress(user_id, wrong_attempts) WHERE wrong_attempts > 0;
CREATE INDEX idx_progress_user_bookmarked ON user_question_progress(user_id, is_bookmarked) WHERE is_bookmarked = TRUE;

CREATE INDEX idx_exam_sessions_user_id ON exam_sessions(user_id);
CREATE INDEX idx_exam_sessions_license_type ON exam_sessions(license_type);
CREATE INDEX idx_exam_sessions_started_at ON exam_sessions(started_at);

CREATE INDEX idx_exam_session_questions_session_id ON exam_session_questions(exam_session_id);
CREATE INDEX idx_exam_session_questions_question_id ON exam_session_questions(question_id);

CREATE INDEX idx_exam_session_answers_session_id ON exam_session_answers(exam_session_id);
CREATE INDEX idx_exam_session_answers_question_id ON exam_session_answers(question_id);
CREATE INDEX idx_exam_session_answers_selected_answer_id ON exam_session_answers(selected_answer_id);
