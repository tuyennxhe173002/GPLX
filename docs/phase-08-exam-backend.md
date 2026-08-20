# Phase 8 - Exam Backend

## Objective

Tao de thi thu tren server, luu bai lam, cham ket qua theo exam profile, va chi tra loi giai sau khi exam ket thuc.

## APIs

```text
POST /api/v1/exams
GET  /api/v1/exams/{examId}
PUT  /api/v1/exams/{examId}/answers/{questionId}
POST /api/v1/exams/{examId}/submit
GET  /api/v1/exams/{examId}/result
```

## State Machine

```text
CREATED -> IN_PROGRESS -> SUBMITTED
                    \-> EXPIRED
```

Sau khi `SUBMITTED` hoac `EXPIRED`, khong duoc sua dap an nua.

## Rules

- Server tao de thi; frontend khong tu gom random questions roi coi do la exam.
- Timer su that nam o `started_at` va `expires_at` tren server.
- Rule thi phai resolve tu `license_exam_profiles`, khong hard-code theo `if/else` Java.
- Ket qua pass/fail phai xet score threshold va critical question rule.

## Tasks

Backend implementation phai tuan thu `docs/backend-monolith-structure.md`.

1. Tao entity `LicenseExamProfile` trong `exam/entity` hoac bang dung chung cho exam domain.
2. Tao `ExamRule`, `ExamRuleResolver` va `ExamGradingService` trong `exam/rules`.
3. Tao entity exam trong `exam/entity` cho `ExamSession`, `ExamSessionQuestion`, `ExamSessionAnswer`.
4. Tao repository trong `exam/repository`.
5. Tao request/response DTO trong `exam/dto/request` va `exam/dto/response`.
6. Tach `ExamQuestionResponse`, `ExamSessionResponse`, `ExamResultResponse`, `ExamResultQuestionResponse`.
7. Tao mapper trong `exam/mapper`.
8. Tao `ExamService` interface trong `exam/service`.
9. Tao `ExamServiceImpl` trong `exam/service/impl`.
10. Tao `ExamController` trong `exam/controller`.
11. Start exam: resolve profile, generate question set, persist session, question order va expires time.
12. Save answer: chi luu dap an, khong tra dung/sai.
13. Submit/expire exam: tinh score, critical failures, pass/fail va persist result.
14. Chi cho phep xem explanation va explanation animation sau khi exam ket thuc.

## Success Criteria

- Tao de thi dung theo profile.
- Cham diem dung, sai cau diem liet thi fail.
- Frontend khong the nhin thay dap an truoc submit.
- Timer va exam state khong phu thuoc dong ho may client.
- Code dung monolith structure: controller, service + impl, dto, mapper, repository, entity, rules, configuration.
