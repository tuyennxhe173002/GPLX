# Phase 4 - Question And Chapter Read APIs

## Objective

Cung cap API lay chapter va question cho che do practice ma khong lam lo dap an, explanation hoac explanation animation.

## APIs

```text
GET /api/v1/chapters
GET /api/v1/questions?chapterId=&page=&size=
GET /api/v1/questions/{id}
GET /api/v1/questions/random?size=20
GET /api/v1/questions/critical
```

## DTO Contract

Question read APIs phai tra `PracticeQuestionResponse` hoac `QuestionSummaryResponse`, khong duoc tra:

- `isCorrect`
- `correctAnswerIds`
- `explanation`
- `animationSolution`

## Tasks

Backend implementation phai tuan thu `docs/backend-monolith-structure.md`.

1. Dat entity trong `chapter/entity` va `question/entity`.
2. Them `QuestionBankVersion` entity/repository neu phase 3 chua hoan tat.
3. Tao enum `QuestionType` trong `question/entity`.
4. Tao repositories trong `chapter/repository` va `question/repository`.
5. Tao DTO response trong `chapter/dto/response` va `question/dto/response`.
6. Tao `AnswerResponse` khong co field `isCorrect`.
7. Tach `QuestionSummaryResponse` va `PracticeQuestionResponse`.
8. Tao mapper trong `chapter/mapper` va `question/mapper`.
9. Tao service interface trong `chapter/service` va `question/service`.
10. Tao service implementation trong `chapter/service/impl` va `question/service/impl`.
11. Tao controller trong `chapter/controller` va `question/controller`.
12. Implement query theo chapter, pagination, random questions va critical questions.
13. Ho tro filter theo question bank version khi can, hoac resolve active bank version tu service.

## Success Criteria

- API tra chapter, question va answer khong lo dap an.
- Response khong co `isCorrect`, `explanation` hoac animation explanation.
- Query theo chuong va pagination hoat dong.
- Code dung monolith structure: controller, service + impl, dto, mapper, repository, entity, configuration.
