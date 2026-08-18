# Phase 8 - Exam Backend

## Objective

Tao de thi thu, luu bai lam va cham ket qua.

## APIs

```text
POST /api/exams/start
POST /api/exams/{examSessionId}/answer
POST /api/exams/{examSessionId}/finish
GET  /api/exams/{examSessionId}/result
```

## Tasks

1. Tao enum `LicenseType`.
2. Tao config `ExamRule` cho A1, B1, B2.
3. Tao `ExamService`.
4. Random questions theo rule.
5. Tao exam session.
6. Luu answers tung cau.
7. Finish exam va tinh correct/wrong.
8. Tinh critical wrong count.
9. Rule pass: du diem va khong sai cau diem liet.

## Success Criteria

- Tao de thi dung so cau.
- Cham diem dung.
- Sai cau diem liet thi fail.
