# Phase 10 - Progress, Wrong Questions And Bookmarks

## Objective

Luu tien do hoc tap cua user va cho phep on lai cau sai/bookmark.

## APIs

```text
GET    /api/progress/summary
GET    /api/progress/wrong-questions
GET    /api/progress/bookmarks
POST   /api/progress/bookmarks/{questionId}
DELETE /api/progress/bookmarks/{questionId}
```

## Tasks

1. Implement register/login JWT.
2. Lay current user tu security context.
3. Update progress khi submit practice answer.
4. Update progress khi finish exam.
5. Tao summary theo chapter.
6. Tao wrong questions page.
7. Tao bookmark/unbookmark.
8. Tao critical questions page.

## Success Criteria

- User login va xem tien do.
- Cau sai duoc luu.
- Bookmark duoc luu.
