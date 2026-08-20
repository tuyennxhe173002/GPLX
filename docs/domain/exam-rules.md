# Exam Rules

## Core Principles

- Server tao de thi.
- Server la source of truth cho timer.
- Rule thi duoc resolve tu profile data.
- Frontend khong nhin thay ket qua tung cau truoc submit.

## State Machine

```text
CREATED -> IN_PROGRESS -> SUBMITTED
                    \-> EXPIRED
```

Sau `SUBMITTED` hoac `EXPIRED`, dap an khong duoc thay doi.

## Start Exam

API:

```text
POST /api/v1/exams
```

Backend phai:

1. Resolve license exam profile.
2. Generate question set.
3. Guarantee cac rang buoc profile.
4. Persist session.
5. Persist question order.
6. Persist `started_at` va `expires_at`.

## Save Answer

API:

```text
PUT /api/v1/exams/{examId}/answers/{questionId}
```

Response chi nen xac nhan da luu, khong tra dung/sai.

## Submit Exam

API:

```text
POST /api/v1/exams/{examId}/submit
```

Backend moi duoc:

- calculate score,
- check critical question failures,
- apply pass/fail rule,
- persist result,
- mo explanation va explanation animation.

## Rule Storage

- Khong hard-code logic theo `if (licenseClass.equals("B"))`.
- Su dung `license_exam_profiles` de luu question count, time limit, pass threshold va critical rule flags.
