# Phase 5 - Practice Answer API

## Objective

Cham dap an luyen tap, tra ket qua va cap nhat tien do neu user da login.

## API

```text
POST /api/practice/answer
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
  "isCorrect": true,
  "correctAnswerIds": [2203],
  "explanation": "Xe tai va xe con chap hanh dung quy tac.",
  "hasAnimation": true
}
```

## Tasks

1. Tao request/response DTO.
2. Validate question ton tai.
3. Validate answer ton tai.
4. Validate answer thuoc question.
5. Cham dung/sai.
6. Lay correct answer ids.
7. Tra explanation.
8. Cap nhat progress neu co authenticated user.

## Success Criteria

- Cham dap an chinh xac.
- Khong chap nhan answer khong thuoc question.
- Tra loi giai sau khi submit.
