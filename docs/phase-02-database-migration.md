# Phase 2 - Database Migration

## Objective

Tao schema PostgreSQL bang Flyway cho cau hoi, dap an, animation, user progress va exam.

## Tasks

1. Tao folder `backend/src/main/resources/db/migration`.
2. Tao file `V1__init_schema.sql`.
3. Them bang `chapters`.
4. Them bang `questions`.
5. Them bang `answers`.
6. Them bang `explanation_animations` voi column JSONB.
7. Them bang `users`.
8. Them bang `user_question_progress`.
9. Them bang `exam_sessions`.
10. Them bang `exam_session_answers`.
11. Them indexes can thiet.

## Success Criteria

- Flyway migrate thanh cong khi start app.
- Schema co day du constraint unique va foreign key.
- Khong tao dap an dung trong frontend.
