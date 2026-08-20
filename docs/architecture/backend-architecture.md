# Backend Architecture

## Style

Backend su dung Spring Boot modular monolith theo feature package.

## Root Structure

```text
backend/src/main/java/com/example/gplx/
  configuration/
  common/
  chapter/
  question/
  practice/
  animation/
  exam/
  progress/
  bookmark/
  auth/
  seed/
```

## Dependency Rules

```text
Controller
  -> Service interface
  -> Service implementation
  -> Repository
  -> Database
```

- Controller khong inject repository.
- Repository khong chua business rule.
- Mapper chi convert `Entity <-> DTO`.

## Question Domain

- `QuestionResponse` tong hop khong duoc dung cho moi use case.
- It nhat tach:
  - `QuestionSummaryResponse`
  - `PracticeQuestionResponse`
  - `PracticeAnswerResult`
  - `ExamQuestionResponse`
  - `ExamResultQuestionResponse`

## Practice Domain

- Input: `questionId`, `answerId`.
- Validate question ton tai.
- Validate answer ton tai.
- Validate answer thuoc question.
- Chi sau do moi cham bai, tra explanation va gate animation explanation.

## Animation Domain

- Luu explanation animation trong JSONB.
- Bat buoc validator schema versioned.
- Khong expose animation solution qua question read APIs.
- Access animation explanation thong qua practice attempt hoac exam result.

## Exam Domain

- State machine: `CREATED -> IN_PROGRESS -> SUBMITTED | EXPIRED`.
- Rule thi duoc resolve tu `license_exam_profiles`.
- Start exam phai do server tao de, persist question order va `expires_at`.
- Save answer khong tra dung/sai.
- Submit exam moi tinh pass/fail.

## Progress And Bookmark Domain

- `user_question_progress` theo huong aggregate hoc tap.
- `bookmarks` la bang rieng.
- Progress update khi submit practice answer, va tuy chon update exam metrics sau submit/expire.

## Seed Domain

- Ho tro `FULL` va `PARTIAL` validation mode.
- `FULL` dung cho production-grade dataset validation.
- `PARTIAL` dung cho local/dev/test.

## Database Direction

Bang cot loi:

- `question_bank_versions`
- `chapters`
- `questions`
- `answers`
- `question_media`
- `explanation_animations`
- `license_exam_profiles`
- `practice_attempts`
- `exam_sessions`
- `exam_session_questions`
- `exam_session_answers`
- `user_question_progress`
- `bookmarks`

## API Safety Checklist

- Question read APIs: no `isCorrect`, no `explanation`.
- Practice result API: duoc tra correctness va explanation.
- Exam answer save API: khong tra correctness.
- Explanation animation: chi sau practice submit hoac exam completed.
