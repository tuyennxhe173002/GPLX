# Phase 5 - Practice Grading API

## Objective

Cham dap an luyen tap, tra ket qua sau khi submit, va cap nhat tien do neu user da login.

## API

```text
POST /api/v1/practice/answers
```

## Request

```json
{
  "questionId": 565,
  "answerId": 2203
}
```

## Response

```json
{
  "questionId": 565,
  "selectedAnswerId": 2203,
  "correct": true,
  "correctAnswerIds": [2203],
  "explanation": "Xe tai va xe con chap hanh dung quy tac.",
  "animation": {
    "available": true,
    "attemptId": 901,
    "animationId": 21
  }
}
```

## Rules

- Day la noi duy nhat trong practice flow duoc tra `correct`, `correctAnswerIds` va `explanation`.
- Neu cau hoi co explanation animation, frontend chi duoc lay animation thong qua attempt da duoc cham.
- Khong cung cap `GET /api/v1/questions/{id}/animation` cho explanation flow.

## Tasks

Backend implementation phai tuan thu `docs/backend-monolith-structure.md`.

1. Tao request/response DTO trong `practice/dto/request` va `practice/dto/response`.
2. Dat ten request la `SubmitPracticeAnswerRequest` va response la `PracticeAnswerResult`.
3. Tao mapper trong `practice/mapper` neu response mapping vuot qua constructor don gian.
4. Tao `PracticeService` interface trong `practice/service`.
5. Tao `PracticeServiceImpl` trong `practice/service/impl`.
6. Tao `PracticeController` trong `practice/controller`.
7. Validate question ton tai.
8. Validate answer ton tai.
9. Validate `answer.question_id == question.id`.
10. Cham dung/sai.
11. Lay `correctAnswerIds`.
12. Tra explanation sau khi submit.
13. Tao `practice_attempts` neu can de luu ket qua va cap quyet truy cap animation.
14. Cap nhat progress neu co authenticated user.

## Success Criteria

- Cham dap an chinh xac.
- Khong chap nhan answer khong thuoc question.
- Chi tra loi giai sau khi submit.
- Explanation animation chi co the truy cap thong qua attempt da duoc cham.
- Code dung monolith structure: controller, service + impl, dto, mapper, repository, entity, configuration.
