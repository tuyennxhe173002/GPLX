# Practice Rules

## Question Read

- Practice question APIs chi tra du lieu can de tra loi.
- Khong tra `isCorrect`, `correctAnswerIds`, `explanation`, `animationSolution`.

## Answer Submission

API chuan:

```text
POST /api/v1/practice/answers
```

Request:

```json
{
  "questionId": 501,
  "answerId": 1001
}
```

## Validation Sequence

1. Find question.
2. Find selected answer.
3. Verify answer thuoc question.
4. Xac dinh correct answer.
5. Cham dung/sai.
6. Tao explanation response.
7. Update progress neu user da login.
8. Attach animation access metadata neu co.

## Result Contract

Result duoc phep tra:

- `correct`
- `correctAnswerIds`
- `explanation`
- thong tin animation explanation sau cham bai

## Animation Access

- Animation explanation chi duoc lay sau submit thanh cong.
- Practice attempt la cach de gate access an toan.
