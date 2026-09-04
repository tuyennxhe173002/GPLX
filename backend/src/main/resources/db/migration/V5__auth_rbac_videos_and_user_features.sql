-- Add role, status, must_change_password, last_login_at to users table
ALTER TABLE users
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN last_login_at TIMESTAMP;

ALTER TABLE users
    ADD CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    ADD CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'DISABLED', 'LOCKED'));

-- Enforce exactly one ADMIN at database level via partial unique index
CREATE UNIQUE INDEX uq_single_admin ON users(role) WHERE role = 'ADMIN';

-- Table for password reset tokens (stores SHA-256 hash of token)
CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Table for RBAC permissions
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_permissions_code_not_blank CHECK (LENGTH(BTRIM(code)) > 0),
    CONSTRAINT chk_permissions_description_not_blank CHECK (LENGTH(BTRIM(description)) > 0)
);

-- Table for Role-Permission mapping
CREATE TABLE role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_role_permissions UNIQUE (role, permission_id),
    CONSTRAINT chk_role_permissions_role CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT'))
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- Insert standard permissions
INSERT INTO permissions (code, description) VALUES
    ('ACCOUNT_VIEW', 'Xem danh sách và thông tin tài khoản người dùng'),
    ('ACCOUNT_ROLE_CHANGE', 'Thay đổi vai trò người dùng (Student <-> Teacher)'),
    ('ACCOUNT_STATUS_CHANGE', 'Khóa hoặc mở khóa tài khoản người dùng'),
    ('ROLE_PERMISSION_VIEW', 'Xem cấu hình phân quyền theo vai trò'),
    ('ROLE_PERMISSION_UPDATE', 'Cập nhật phân quyền cho các vai trò'),
    ('QUESTION_VIEW', 'Xem câu hỏi và giải thích'),
    ('VIDEO_VIEW', 'Xem video giải thích sa hình'),
    ('VIDEO_CREATE', 'Thêm video giải thích sa hình'),
    ('VIDEO_UPDATE', 'Cập nhật video giải thích sa hình'),
    ('VIDEO_DELETE', 'Xóa video giải thích sa hình'),
    ('HISTORY_VIEW_OWN', 'Xem lịch sử học tập và thi của bản thân'),
    ('BOOKMARK_MANAGE_OWN', 'Quản lý câu hỏi đánh dấu của bản thân'),
    ('PROGRESS_VIEW_OWN', 'Xem tiến độ học và câu sai của bản thân');

-- Seed default permissions for STUDENT
INSERT INTO role_permissions (role, permission_id)
SELECT 'STUDENT', id FROM permissions WHERE code IN (
    'QUESTION_VIEW',
    'VIDEO_VIEW',
    'HISTORY_VIEW_OWN',
    'BOOKMARK_MANAGE_OWN',
    'PROGRESS_VIEW_OWN'
);

-- Seed default permissions for TEACHER
INSERT INTO role_permissions (role, permission_id)
SELECT 'TEACHER', id FROM permissions WHERE code IN (
    'QUESTION_VIEW',
    'VIDEO_VIEW',
    'HISTORY_VIEW_OWN',
    'BOOKMARK_MANAGE_OWN',
    'PROGRESS_VIEW_OWN',
    'VIDEO_CREATE',
    'VIDEO_UPDATE',
    'VIDEO_DELETE'
);

-- Seed default permissions for ADMIN (all permissions)
INSERT INTO role_permissions (role, permission_id)
SELECT 'ADMIN', id FROM permissions;

-- Table for Question Explanation Videos (Google Drive, etc.)
CREATE TABLE question_explanation_videos (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'GOOGLE_DRIVE',
    source_url TEXT NOT NULL,
    external_file_id VARCHAR(255) NOT NULL,
    embed_url TEXT NOT NULL,
    title VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_video_provider CHECK (provider IN ('GOOGLE_DRIVE', 'YOUTUBE')),
    CONSTRAINT chk_video_source_not_blank CHECK (LENGTH(BTRIM(source_url)) > 0),
    CONSTRAINT chk_video_file_id_not_blank CHECK (LENGTH(BTRIM(external_file_id)) > 0),
    CONSTRAINT chk_video_embed_url_not_blank CHECK (LENGTH(BTRIM(embed_url)) > 0)
);

CREATE INDEX idx_question_explanation_videos_question ON question_explanation_videos(question_id);
CREATE INDEX idx_question_explanation_videos_is_active ON question_explanation_videos(is_active);
