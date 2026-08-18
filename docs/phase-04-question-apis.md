# Phase 4 - Question And Chapter APIs

## Objective

Cung cap API lay chuong va cau hoi ma khong lam lo dap an dung.

## APIs

```text
GET /api/chapters
GET /api/questions?chapterId=&page=&size=
GET /api/questions/{id}
GET /api/questions/random?size=20
GET /api/questions/critical
```

## Tasks

1. Tao entity `Chapter`.
2. Tao entity `Question`.
3. Tao entity `Answer`.
4. Tao enum `QuestionType`.
5. Tao repositories.
6. Tao DTO `ChapterResponse`.
7. Tao DTO `QuestionResponse`.
8. Tao DTO `AnswerResponse` khong co field `isCorrect`.
9. Implement service lay cau hoi theo chuong.
10. Implement pagination.
11. Implement random questions.
12. Implement critical questions.

## Success Criteria

- API tra cau hoi va dap an.
- Response khong co `isCorrect`.
- Query theo chuong va pagination hoat dong.
