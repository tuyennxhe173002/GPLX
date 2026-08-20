# Progress Rules

## Goal

Luu hoc tap theo user-question, truy van cau sai va bookmark ma khong tron hai concept nay vao mot bang.

## Progress Aggregate

Bang `user_question_progress` nen chua:

- `user_id`
- `question_id`
- `attempt_count`
- `correct_count`
- `wrong_count`
- `last_answer_id`
- `last_correct`
- `last_attempt_at`
- `mastery_score`

Unique key:

```sql
UNIQUE(user_id, question_id)
```

## Update Points

- Practice: update sau `POST /api/v1/practice/answers`.
- Exam: co the update aggregate sau khi exam submit/expire, tuy muc tieu analytics.

## Bookmarks

Bookmark la bang rieng:

- `user_id`
- `question_id`
- `created_at`

Khong them `is_bookmarked` vao `user_question_progress`.

## Query Goals

- Summary tong quan.
- Summary theo chapter.
- Wrong questions.
- Bookmarks.
- Critical question review tai su dung query question domain.
