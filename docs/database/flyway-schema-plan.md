# Flyway Schema Plan

## Scope

Tai lieu nay mo ta schema plan va migration direction cho ba khoi moi da duoc dua vao contract kien truc:

- `question_bank_versions`
- `license_exam_profiles`
- `practice_attempts`

Migration hien tai da duoc them o:

```text
backend/src/main/resources/db/migration/V2__architecture_contract_updates.sql
backend/src/main/resources/db/migration/V3__bookmarks_and_exam_profile_updates.sql
backend/src/main/resources/db/migration/V4__seed_full_exam_profiles_and_auth_alignment.sql
```

## Goals

1. Dua question bank versioning vao persistence ma khong pha code seed/read API hien tai.
2. Chuyen exam rules sang data-driven profile.
3. Tao persisted boundary cho practice grading result va explanation animation access.

## V2 Summary

### question_bank_versions

Bang moi de version hoa dataset.

Cot chinh:

- `bank_code`
- `version`
- `question_count`
- `critical_question_count`
- `source`
- `effective_from`
- `is_active`

Rang buoc:

- unique `(bank_code, version)`
- `question_count > 0`
- `critical_question_count >= 0`
- `question_count >= critical_question_count`

Backfill:

- Insert default row `CSGT-600-2025 / 2025.06` voi `id = 1`

### chapters / questions linking

Them `question_bank_version_id` vao:

- `chapters`
- `questions`

Huong xu ly trong V2:

- column moi `NOT NULL DEFAULT 1`
- drop unique toan cuc cu
- them unique moi:
  - `chapters(question_bank_version_id, code)`
  - `questions(question_bank_version_id, question_number)`

Ly do dung `DEFAULT 1`:

- giu cho seed/import hien tai chay duoc truoc khi code seed duoc refactor day du theo bank version.

### license_exam_profiles

Bang moi cho exam rules.

Cot chinh:

- `question_bank_version_id`
- `profile_code`
- `display_name`
- `question_count`
- `duration_minutes`
- `passing_score`
- `critical_fail_enabled`
- `is_active`

Rang buoc:

- unique `(question_bank_version_id, profile_code)`
- `question_count > 0`
- `duration_minutes > 0`
- `passing_score >= 0`
- `passing_score <= question_count`

### practice_attempts

Bang moi cho practice grading flow.

Cot chinh:

- `user_id` nullable
- `question_id`
- `selected_answer_id`
- `is_correct`
- `created_at`
- `updated_at`

Ly do:

- luu lich su submit practice,
- gate explanation animation qua `attemptId`,
- tao diem mo rong cho progress/auth sau nay.

## V3 Summary

### bookmarks

Bang moi:

- `bookmarks`

Cot chinh:

- `user_id`
- `question_id`
- `created_at`
- `updated_at`

Huong migrate:

1. Tao bang `bookmarks`.
2. Backfill tu `user_question_progress.is_bookmarked = true`.
3. Drop index bookmark cu tren progress.
4. Drop cot `is_bookmarked` khoi `user_question_progress`.

### exam profile updates

Bo sung:

- `license_exam_profiles.critical_question_count`
- `exam_sessions.user_id` cho phep `NULL`
- `exam_session_answers.is_correct` cho phep `NULL` truoc khi submit

Backfill exam profiles dev:

- `A1`
- `B`

Day la profile khoi tao de exam backend co the van hanh theo contract moi. Bo profile production cuoi cung van nen duoc doi chieu lai theo quy dinh chinh thuc.

## Exam Session Compatibility

V2 cung them cac cot nhe vao `exam_sessions` de giai phong phase exam sau:

- `license_exam_profile_id`
- `state`
- `expires_at`

Day la buoc chuyen tiep, chua bat buoc exam backend hien tai phai dung ngay.

## Follow-Up Migrations

### V3 seed refactor

- Doc `manifest.json`
- Ho tro `FULL` va `PARTIAL`
- Import theo `question_bank_version_id`

### V4 exam profile completion and auth alignment

- Drop constraint enum cu cua `exam_sessions.license_type`
- Seed/upsert bo `license_exam_profiles` day du theo he phan hang hien hanh
- Chuan bi mat dat cho auth that va `/me` endpoints dung security context

### V5 exam full rule engine

- Seed `license_exam_profiles`
- Chuyen `exam_sessions.license_type` sang profile-driven flow
- Hoan thien exam result/explanation gating

## Verification Checklist

Sau khi chay migration:

1. `question_bank_versions` co row mac dinh `id = 1`.
2. `chapters.question_bank_version_id` va `questions.question_bank_version_id` deu `NOT NULL`.
3. Unique moi cho chapters/questions co hieu luc.
4. `practice_attempts` ton tai va ghi duoc.
5. `license_exam_profiles` ton tai de seed rules sau nay.
