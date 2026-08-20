# Phase 3 - Question Bank Import And Validation

## Objective

Import question bank version vao PostgreSQL, validate integrity truoc khi app san sang phuc vu, va khong khoa chat quy trinh development vao dataset du 600 cau.

## Source Files

```text
data/question-banks/csgt-2025/manifest.json
data/question-banks/csgt-2025/chapters.json
data/question-banks/csgt-2025/questions.json
data/question-banks/csgt-2025/animations.json
data/question-banks/csgt-2025/assets/
```

## Required Manifest Contract

```json
{
  "bankCode": "CSGT-600-2025",
  "version": "2025.06",
  "questionCount": 600,
  "criticalQuestionCount": 60,
  "source": "Cuc Canh sat giao thong",
  "effectiveFrom": "2025-06-01"
}
```

## Tasks

Backend implementation phai tuan thu `docs/backend-monolith-structure.md`.

1. Tao import DTO trong `seed/dto` cho manifest, chapter, question, answer va animation payload.
2. Tao `QuestionBankValidationMode` trong `seed` hoac `seed/validation` voi it nhat `FULL` va `PARTIAL`.
3. Tao `DataImportService` interface trong `seed/service`.
4. Tao `DataImportServiceImpl` trong `seed/service/impl`.
5. Tao validator trong `seed/validation` cho manifest, question bank va animation reference.
6. Tao `DataImportRunner implements CommandLineRunner` trong `seed/runner` va chi goi service.
7. Them config:

```yaml
app:
  seed:
    enabled: true
    validation-mode: FULL
```

8. Them bang `question_bank_versions` va import/lookup bank version truoc.
9. Import chapters theo `question_bank_version_id`.
10. Import questions va answers theo bank version.
11. Import animations theo `questionNumber` trong bank version do.
12. Neu dataset va bank version da ton tai day du thi skip import an toan.
13. Validate `FULL`: dung `questionCount` trong manifest, numbering day du, critical count dung, du animation cho question `hasAnimation=true`.
14. Validate `PARTIAL`: cho phep tap con, nhung van phai validate uniqueness, answer count, correct answer count, chapter code va reference consistency.
15. Bao loi start-up neu validation fail.

## Success Criteria

- App dung start neu data loi.
- App start thanh cong neu data hop le.
- Seed co the chay voi dataset `FULL` va `PARTIAL`.
- Question bank duoc version hoa, khong coi 600 cau la tap du lieu vinh vien.
- Runner khong chua business logic lon; logic import/validate nam trong service + validator.
