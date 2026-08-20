# GPLX 600 Questions Website - Implementation Plan

## 1. Purpose

Tai lieu nay chot architecture contract, implementation order va delivery guardrails cho du an GPLX. Muc tieu la giu huong React + TypeScript, Spring Boot modular monolith va PostgreSQL, dong thoi loai bo cac diem de phai refactor lon o phase 5-10.

## 2. Product Scope

### In Scope

- Luyen theo chuong.
- Luyen ngau nhien.
- On cau diem liet.
- Thi thu theo hang GPLX.
- Cham dap an va hien loi giai.
- Hien animation explanation cho cau sa hinh.
- Luu tien do hoc tap.
- On cau sai.
- Bookmark cau hoi.

### Out of Scope

- Admin CMS.
- CRUD cau hoi tren UI.
- Chinh sua animation tren UI.
- Payment.
- Social login.
- Native mobile app.

## 3. Architecture Contract

### System Shape

```text
React + TypeScript frontend
        |
     REST/JSON
        |
Spring Boot modular monolith
        |
    PostgreSQL
```

### Non-Negotiable Rules

1. Khong tra `Answer.isCorrect` trong APIs lay question.
2. Khong tra `explanation` trong APIs lay question cho practice/exam.
3. Khong cho lay explanation animation truoc khi practice answer da submit hoac exam da ket thuc.
4. Rule thi khong hard-code theo `if/else license class`; phai resolve tu data profile.
5. Question bank phai co version; khong coi bo 600 cau la bat bien vinh vien.
6. Seed phai ho tro `FULL` va `PARTIAL` validation mode.
7. Them `/api/v1` ngay tu dau.

## 4. Canonical Docs

- `docs/backend-monolith-structure.md`
- `docs/architecture/system-architecture.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/animation-engine.md`
- `docs/domain/practice-rules.md`
- `docs/domain/exam-rules.md`
- `docs/domain/progress-rules.md`
- `docs/adr/001-modular-monolith.md`
- `docs/adr/002-question-bank-versioning.md`
- `docs/adr/003-animation-json-format.md`

## 5. Recommended Monorepo Structure

```text
GPLX/
  backend/
  frontend/
  data/
    question-banks/
      csgt-2025/
        manifest.json
        chapters.json
        questions.json
        animations.json
        assets/
  docs/
    architecture/
    domain/
    api/
    adr/
  infra/
    docker/
    nginx/
    postgres/
  scripts/
  docker-compose.yml
  README.md
```

## 6. Backend Contract

- Feature-first modular monolith.
- `configuration/` cho config dung chung.
- `common/` chi chua code that su cross-feature.
- Controller -> service interface -> service impl -> repository -> database.
- Mapper chi dung cho `Entity <-> DTO`.
- Entity khong expose truc tiep ra API.
- Tachdto cho practice, exam, result; khong dung mot `QuestionResponse` cho moi mode.

Tham chieu chi tiet: `docs/architecture/backend-architecture.md`.

## 7. Frontend Contract

- Feature-first de mirror domain backend.
- Animation la reusable renderer, khong tao component dac thu cho tung cau sa hinh.
- Practice flow va exam flow tach state va API contract.
- Timer exam chi la display; server la source of truth.

Tham chieu chi tiet: `docs/architecture/frontend-architecture.md`.

## 8. Data Contract

### Question Bank Manifest

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

### Database Direction

Core tables:

- `question_bank_versions`
- `chapters`
- `questions`
- `answers`
- `question_media`
- `explanation_animations`
- `license_exam_profiles`
- `users`
- `practice_attempts`
- `user_question_progress`
- `bookmarks`
- `exam_sessions`
- `exam_session_questions`
- `exam_session_answers`

Uniqueness:

```sql
UNIQUE(question_bank_version_id, question_number)
UNIQUE(user_id, question_id)
```

## 9. API Direction

```text
GET    /api/v1/chapters
GET    /api/v1/questions
GET    /api/v1/questions/{id}
GET    /api/v1/questions/random
GET    /api/v1/questions/critical

POST   /api/v1/practice/answers
GET    /api/v1/practice/attempts/{attemptId}/animation

POST   /api/v1/exams
GET    /api/v1/exams/{examId}
PUT    /api/v1/exams/{examId}/answers/{questionId}
POST   /api/v1/exams/{examId}/submit
GET    /api/v1/exams/{examId}/result

GET    /api/v1/me/progress
GET    /api/v1/me/progress/chapters
GET    /api/v1/me/wrong-questions
GET    /api/v1/me/bookmarks
POST   /api/v1/me/bookmarks/{questionId}
DELETE /api/v1/me/bookmarks/{questionId}

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
```

## 10. Delivery Order

Implementation order moi:

1. Chuan hoa question DTO contract.
2. Hoan thanh practice grading API.
3. Chot animation JSON schema.
4. Xay frontend animation engine.
5. Hoan thien 600-question dataset.
6. Dua question-bank versioning vao persistence va import.
7. Dua exam profiles/rules vao backend.
8. Hoan thanh exam backend.
9. Hoan thanh exam frontend.
10. Them authentication.
11. Hoan thanh progress + bookmarks.
12. Test.
13. Production deployment.

## 11. Phase Plan

### Phase 1 - Bootstrap

- Monorepo backend/frontend.
- Docker Compose cho app + postgres.
- Base Spring Boot + React app.

### Phase 2 - Database Foundation

- Flyway baseline cho chapters, questions, answers.
- Bo sung bang versioning, exam va progress theo contract moi.

### Phase 3 - Question Bank Import

- Import manifest, chapters, questions, answers, animations.
- Ho tro `FULL` va `PARTIAL` validation mode.

### Phase 4 - Question Read APIs

- `chapters`, `questions`, `random`, `critical`.
- Khong tra `isCorrect`, `explanation` hay explanation animation.

### Phase 5 - Practice Grading API

- `POST /api/v1/practice/answers`.
- Cham bai, tra `correct`, `correctAnswerIds`, `explanation`.
- Tao attempt de cap quyet lay animation explanation.

### Phase 6 - Practice Frontend

- UI luyen theo chuong/ngau nhien/cau diem liet.
- Practice result panel dung contract Phase 5.

### Phase 7 - Animation Contract And Engine

- Chot schema JSON.
- Backend validator + explanation animation access control.
- Frontend SVG scene + timeline engine.

### Phase 8 - Exam Backend

- `license_exam_profiles`.
- Server-generated exam sessions.
- Submit/expire flow va result.

### Phase 9 - Exam Frontend

- Thi thu UI, timer display, navigation, submit flow.
- Xem ket qua va explanation sau khi ket thuc.

### Phase 10 - Auth, Progress, Bookmarks

- JWT auth.
- `user_question_progress`.
- `bookmarks` tach rieng.

### Phase 11 - Testing

- Unit tests cho grading, import validation, exam rules.
- Integration tests cho practice/exam APIs.
- Frontend tests cho practice flow va animation engine core.

### Phase 12 - Deployment

- Docker images.
- Reverse proxy.
- Environment configuration.

## 12. Risk Controls

### Risk 1 - Leaking answers through question APIs

Mitigation: khong tra `isCorrect`, `explanation`, explanation animation trong read APIs.

### Risk 2 - Animation JSON bi drift

Mitigation: schema version hoa, validator backend, typed contract frontend.

### Risk 3 - Exam rule thay doi theo quy dinh moi

Mitigation: dua profile vao bang du lieu va resolver layer.

### Risk 4 - Dataset chua du 600 cau lam block dev

Mitigation: seed `PARTIAL` mode cho local/dev/test, `FULL` mode cho production validation.

## 13. Current Priority

Neu tiep tuc tu state hien tai, uu tien lam theo thu tu:

1. Sync docs va contracts nay.
2. Refactor question/practice DTO theo contract moi.
3. Chot animation schema va endpoint gating.
4. Dua exam profile + question bank versioning vao model truoc khi lam exam backend day du.
