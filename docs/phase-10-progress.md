# Phase 10 - Progress, Wrong Questions And Bookmarks

## Objective

Luu tien do hoc tap cua user, phan tach bookmark khoi progress, va ho tro on lai cau sai/cau diem liet.

## APIs

```text
GET    /api/v1/me/progress
GET    /api/v1/me/progress/chapters
GET    /api/v1/me/wrong-questions
GET    /api/v1/me/bookmarks
POST   /api/v1/me/bookmarks/{questionId}
DELETE /api/v1/me/bookmarks/{questionId}
```

## Data Rules

`user_question_progress` nen theo huong:

```text
user_id
question_id
attempt_count
correct_count
wrong_count
last_answer_id
last_correct
last_attempt_at
mastery_score
```

Bookmark la bang rieng, khong nhung `is_bookmarked` vao progress.

## Tasks

Backend implementation phai tuan thu `docs/backend-monolith-structure.md`.

1. Implement register/login JWT theo feature `auth` voi controller, service + impl, dto, mapper, repository/entity neu can.
2. Dat security/config dung chung trong `configuration`.
3. Tao feature `progress` voi controller, service + impl, dto, mapper, repository/entity.
4. Tao feature `bookmark` rieng voi controller, service + impl, repository/entity.
5. Lay current user tu security context thong qua service/helper dung chung, khong doc truc tiep trong repository.
6. Update progress khi submit practice answer.
7. Update progress khi submit/expire exam neu muon track ket qua exam-level.
8. Tao summary theo chapter.
9. Tao wrong questions page.
10. Tao bookmark/unbookmark.
11. Tao critical questions page neu can tai su dung query question domain.

## Success Criteria

- User login va xem tien do.
- Cau sai duoc luu va truy van duoc.
- Bookmark duoc luu o bang rieng.
- Progress va bookmark la hai concept tach biet.
- Backend code dung monolith structure: controller, service + impl, dto, mapper, repository, entity, configuration.
