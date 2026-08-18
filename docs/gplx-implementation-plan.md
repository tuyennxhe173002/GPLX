# GPLX 600 Questions Website - Implementation Plan

## 1. Product Scope

Website luyen 600 cau ly thuyet GPLX co dinh, khong co admin CMS. Nguoi dung truy cap website de hoc, luyen theo chuong, thi thu, on cau sai, on cau diem liet va xem loi giai. Cac cau sa hinh co the co animation mo phong xe chuyen dong dung theo dap an.

### In Scope

- 600 cau hoi co dinh duoc seed vao database.
- Chia cau hoi theo chuong.
- Luyen theo chuong.
- Luyen ngau nhien.
- Thi thu theo hang bang.
- Cham dap an va hien loi giai.
- Hien animation cho cau sa hinh co du lieu animation.
- Luu tien do hoc tap.
- On cau sai.
- On cau diem liet.
- Bookmark cau hoi.

### Out of Scope

- Admin dashboard.
- CRUD cau hoi tren UI.
- Upload anh tu UI.
- Sua animation tren UI.
- Payment.
- Social login.
- Mobile app native.

## 2. Recommended Architecture

```text
React TypeScript Frontend
  |
  | REST API
  v
Spring Boot Backend
  |
  | Spring Data JPA
  v
PostgreSQL
```

### Backend Stack

- Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- PostgreSQL
- Flyway
- Lombok
- Jackson
- Hibernate JSON support for PostgreSQL JSONB

### Frontend Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- SVG animation with requestAnimationFrame

### Recommended Monorepo Structure

```text
gplx/
  backend/
    src/main/java/com/example/gplx/
    src/main/resources/db/migration/
    src/main/resources/data/
  frontend/
    public/images/questions/
    src/
  docs/
  docker-compose.yml
  README.md
```

## 3. Data Strategy

Nguon data chuan nen den tu sach/PDF chinh thuc "600 cau hoi dung cho sat hach lai xe co gioi duong bo" ban moi nhat hoac tai lieu cua trung tam dao tao uy tin da doi chieu voi bo de hien hanh.

### Source Files

```text
backend/src/main/resources/data/chapters.json
backend/src/main/resources/data/questions.json
backend/src/main/resources/data/animations.json
frontend/public/images/questions/001.png
frontend/public/images/questions/565.png
```

### Question JSON Contract

```json
{
  "questionNumber": 565,
  "chapterCode": "SA_HINH",
  "content": "Cac xe di theo huong mui ten, xe nao chap hanh dung quy tac giao thong?",
  "imageUrl": "/images/questions/565.png",
  "questionType": "TRAFFIC_SCENE",
  "isCritical": false,
  "hasAnimation": true,
  "answers": [
    { "label": "1", "content": "Xe tai, xe mo to.", "isCorrect": false },
    { "label": "2", "content": "Xe khach, xe mo to.", "isCorrect": false },
    { "label": "3", "content": "Xe tai, xe con.", "isCorrect": true },
    { "label": "4", "content": "Xe mo to, xe con.", "isCorrect": false }
  ],
  "explanation": "Xe tai va xe con chap hanh dung quy tac giao thong."
}
```

### Animation JSON Contract

```json
{
  "questionNumber": 565,
  "sceneWidth": 800,
  "sceneHeight": 500,
  "backgroundImageUrl": "/images/questions/565.png",
  "durationMs": 6000,
  "animationData": {
    "vehicles": [
      {
        "id": "truck",
        "type": "truck",
        "label": "Xe tai",
        "start": { "x": 250, "y": 350, "rotation": -20 },
        "path": [
          { "x": 250, "y": 350 },
          { "x": 340, "y": 300 },
          { "x": 470, "y": 220 },
          { "x": 620, "y": 150 }
        ],
        "startTimeMs": 500,
        "durationMs": 2500,
        "isCorrect": true
      }
    ],
    "steps": [
      {
        "timeMs": 0,
        "title": "Phan tich tinh huong",
        "description": "Quan sat huong mui ten va tin hieu dieu khien."
      }
    ],
    "correctVehicleIds": ["truck"]
  }
}
```

## 4. Database Schema

### chapters

```sql
CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL
);
```

### questions

```sql
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL REFERENCES chapters(id),
    question_number INT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image_url TEXT,
    question_type VARCHAR(50) NOT NULL,
    explanation TEXT,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    has_animation BOOLEAN NOT NULL DEFAULT FALSE
);
```

### answers

```sql
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id),
    label VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL
);
```

### explanation_animations

```sql
CREATE TABLE explanation_animations (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL UNIQUE REFERENCES questions(id),
    scene_width INT NOT NULL,
    scene_height INT NOT NULL,
    background_image_url TEXT,
    duration_ms INT NOT NULL,
    animation_data JSONB NOT NULL
);
```

### users

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### user_question_progress

```sql
CREATE TABLE user_question_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    question_id BIGINT NOT NULL REFERENCES questions(id),
    total_attempts INT NOT NULL DEFAULT 0,
    correct_attempts INT NOT NULL DEFAULT 0,
    wrong_attempts INT NOT NULL DEFAULT 0,
    last_selected_answer_id BIGINT REFERENCES answers(id),
    last_is_correct BOOLEAN,
    is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);
```

### exam_sessions

```sql
CREATE TABLE exam_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    license_type VARCHAR(20) NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL DEFAULT 0,
    wrong_count INT NOT NULL DEFAULT 0,
    critical_wrong_count INT NOT NULL DEFAULT 0,
    is_passed BOOLEAN,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMP
);
```

### exam_session_answers

```sql
CREATE TABLE exam_session_answers (
    id BIGSERIAL PRIMARY KEY,
    exam_session_id BIGINT NOT NULL REFERENCES exam_sessions(id),
    question_id BIGINT NOT NULL REFERENCES questions(id),
    selected_answer_id BIGINT REFERENCES answers(id),
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## 5. Backend Package Structure

```text
backend/src/main/java/com/example/gplx/
  common/
  auth/
  chapter/
  question/
  animation/
  practice/
  exam/
  progress/
  seed/
```

## 6. REST API Contract

### Public/Auth APIs

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Chapter APIs

```text
GET /api/chapters
```

### Question APIs

```text
GET /api/questions?chapterId=&page=&size=
GET /api/questions/{id}
GET /api/questions/random?size=20
GET /api/questions/critical
GET /api/questions/{id}/animation
```

### Practice APIs

```text
POST /api/practice/answer
```

### Exam APIs

```text
POST /api/exams/start
POST /api/exams/{examSessionId}/answer
POST /api/exams/{examSessionId}/finish
GET  /api/exams/{examSessionId}/result
```

### Progress APIs

```text
GET    /api/progress/summary
GET    /api/progress/wrong-questions
GET    /api/progress/bookmarks
POST   /api/progress/bookmarks/{questionId}
DELETE /api/progress/bookmarks/{questionId}
```

## 7. Frontend Structure

```text
frontend/src/
  app/
    router.tsx
    queryClient.ts
  api/
    http.ts
    chapterApi.ts
    questionApi.ts
    practiceApi.ts
    examApi.ts
    progressApi.ts
  components/
    AppLayout.tsx
    Header.tsx
    Button.tsx
    Card.tsx
    Loading.tsx
  features/
    home/
    chapters/
    practice/
    animation/
    exam/
    progress/
  types/
    question.ts
    animation.ts
    exam.ts
    chapter.ts
```

## 8. Phased Implementation Roadmap

### Phase 1 - Project Bootstrap

Objective: Tao skeleton backend, frontend va database chay duoc cung nhau.

Tasks:

1. Tao folder `backend` bang Spring Initializr.
2. Tao folder `frontend` bang Vite React TypeScript.
3. Tao `docker-compose.yml` cho PostgreSQL.
4. Cau hinh backend ket noi database.
5. Them endpoint `GET /api/health`.
6. Cau hinh CORS cho frontend local.
7. Frontend goi health API va hien trang Home tam.

Success criteria:

- `backend` chay tren port 8080.
- `frontend` chay tren port 5173.
- PostgreSQL chay tren port 5432.
- Frontend goi duoc `/api/health`.

### Phase 2 - Database Migration

Objective: Tao schema database bang Flyway.

Tasks:

1. Them Flyway dependency.
2. Tao `V1__init_schema.sql`.
3. Tao cac bang core: chapters, questions, answers, explanation_animations.
4. Tao cac bang user progress va exam.
5. Tao index cho question number, chapter id, critical flag.
6. Chay app va kiem tra migration thanh cong.

Success criteria:

- Database co day du bang.
- App start khong loi migration.

### Phase 3 - Data Import And Validation

Objective: Import 600 cau co dinh tu JSON vao database.

Tasks:

1. Tao `chapters.json`.
2. Tao `questions.json`.
3. Tao `animations.json`.
4. Tao DTO import.
5. Tao `DataImportRunner`.
6. Neu database da co data thi khong import lai.
7. Validate du 600 cau.
8. Validate moi cau co dung 1 dap an dung.
9. Validate question number khong trung.
10. Validate cau `hasAnimation=true` phai co animation.

Success criteria:

- Database co dung 600 cau.
- Import fail fast neu data sai.
- Khong expose dap an dung ra frontend qua question list/detail API.

### Phase 4 - Question And Chapter Backend APIs

Objective: Cung cap API doc cau hoi, chuong va chi tiet cau hoi.

Tasks:

1. Tao entity `Chapter`, `Question`, `Answer`.
2. Tao repository.
3. Tao DTO response khong co `isCorrect`.
4. Tao `ChapterService` va `QuestionService`.
5. Tao API lay danh sach chuong co thong ke tong cau.
6. Tao API lay cau hoi theo chuong.
7. Tao API lay chi tiet cau hoi.
8. Tao API lay cau ngau nhien.
9. Tao API lay cau diem liet.

Success criteria:

- Frontend lay duoc chuong va cau hoi.
- Dap an dung khong bi lo truoc khi submit.

### Phase 5 - Practice Answer Backend APIs

Objective: Cham dap an va tra loi giai.

Tasks:

1. Tao request `SubmitAnswerRequest`.
2. Tao response `SubmitAnswerResponse`.
3. Implement `PracticeService`.
4. Tim cau hoi va dap an user chon.
5. Kiem tra dap an co thuoc cau hoi do khong.
6. Cham dung/sai.
7. Tra correct answer ids, explanation va hasAnimation.
8. Neu co user login thi cap nhat progress.

Success criteria:

- Submit dap an tra ket qua dung.
- Sai answer id hoac answer khong thuoc question thi bi reject.
- Progress duoc update neu user da login.

### Phase 6 - Frontend Practice UI

Objective: Nguoi dung luyen theo chuong duoc tu dau den cuoi.

Tasks:

1. Tao router.
2. Tao API client Axios/fetch.
3. Tao TanStack Query setup.
4. Tao trang Home.
5. Tao trang Chapters.
6. Tao trang Practice.
7. Tao `QuestionCard`.
8. Tao `AnswerOption`.
9. Tao `ExplanationPanel`.
10. Sau submit, highlight dap an dung/sai.
11. Tao nut next/previous.
12. Luu state cau dang lam trong URL hoac local state.

Success criteria:

- Chon chuong va lam cau hoi duoc.
- Submit hien dung/sai va loi giai.
- UI responsive tren mobile.

### Phase 7 - Animation Engine MVP

Objective: Render duoc xe chuyen dong theo JSON animation.

Tasks:

1. Tao type `ExplanationAnimationData`.
2. Tao API `GET /api/questions/{id}/animation`.
3. Tao `AnimatedScene` bang SVG.
4. Tao `VehicleSprite`.
5. Tao `useScenePlayer` dung `requestAnimationFrame`.
6. Implement interpolate theo path.
7. Render background image.
8. Render vehicle icons.
9. Render timeline steps.
10. Them Play, Pause, Replay, Speed controls.

Success criteria:

- Cau co animation hien scene.
- Xe chay dung path va startTime.
- Timeline doi theo thoi gian.
- Replay khong loi.

### Phase 8 - Exam Mode Backend

Objective: Tao va cham bai thi thu.

Tasks:

1. Tao enum `LicenseType`.
2. Tao config so cau, thoi gian, diem dat cho A1/B1/B2.
3. Implement random question selection.
4. Tao exam session.
5. Luu cau hoi thuoc session.
6. Submit tung answer.
7. Finish exam va tinh ket qua.
8. Neu sai cau diem liet thi fail.

Success criteria:

- Tao de thi dung so cau.
- Cham dung diem.
- Sai cau diem liet thi truot.

### Phase 9 - Exam Mode Frontend

Objective: UI thi thu hoan chinh.

Tasks:

1. Tao trang chon hang bang.
2. Tao `ExamPage`.
3. Tao timer.
4. Tao navigator so cau.
5. Luu selected answers.
6. Submit answer tung cau hoac finish mot lan.
7. Tao trang ket qua.
8. Tao review cau sai.

Success criteria:

- User lam bai thi day du.
- Het gio tu dong nop bai.
- Review lai dap an va loi giai.

### Phase 10 - Progress, Wrong Questions And Bookmarks

Objective: Luu va hien tien do hoc tap.

Tasks:

1. Implement JWT auth don gian.
2. Tao progress summary API.
3. Tao wrong questions API.
4. Tao bookmark API.
5. Frontend hien dashboard tien do.
6. Tao trang on cau sai.
7. Tao trang cau bookmark.
8. Tao trang cau diem liet.

Success criteria:

- User xem duoc tien do.
- User on lai cau sai.
- Bookmark persist qua nhieu lan login.

### Phase 11 - Testing And Quality Gate

Objective: Dam bao logic cham diem, data va animation khong sai.

Backend tests:

1. Import du 600 cau.
2. Khong expose dap an dung qua question API.
3. Submit dap an dung/sai.
4. Reject answer khong thuoc question.
5. Exam pass/fail.
6. Critical wrong causes fail.
7. Animation API tra data dung cau.

Frontend tests:

1. Render question.
2. Select answer.
3. Show explanation.
4. Play/replay animation.
5. Timer exam.

Success criteria:

- Backend tests pass.
- Frontend build pass.
- Manual smoke test pass.

### Phase 12 - Deployment

Objective: Dua website len production.

Tasks:

1. Dockerize backend.
2. Build frontend static.
3. Cau hinh Nginx serve frontend.
4. Proxy `/api` ve backend.
5. Cau hinh PostgreSQL volume.
6. Cau hinh env production.
7. Cau hinh HTTPS.
8. Backup database.

Success criteria:

- Website truy cap duoc qua domain.
- API chay on dinh.
- Anh cau hoi load dung.
- Animation load dung.

## 9. Implementation Order For MVP

Lam theo thu tu sau de ra san pham nhanh:

1. Phase 1: Project Bootstrap.
2. Phase 2: Database Migration.
3. Phase 3: Import 600 cau.
4. Phase 4: Question APIs.
5. Phase 6: Practice UI.
6. Phase 5: Submit answer API.
7. Phase 7: Animation cho 5 cau mau.
8. Phase 8 va 9: Exam mode.
9. Phase 10: Progress.
10. Phase 11 va 12: Test va deploy.

## 10. Coding Rules

- Backend khong tra `isCorrect` trong API lay cau hoi.
- Chi tra dap an dung sau khi user submit hoac review ket qua thi.
- Data 600 cau la source-controlled JSON.
- Animation la JSON, khong hard-code trong React component.
- Anh cau hoi khong luu trong database.
- Database chi luu URL anh.
- Import runner phai validate data va fail fast.
- DTO response phai tach rieng voi entity.
- Service layer chua business logic, controller chi mapping request/response.
- Frontend type phai match API contract.

## 11. Definition Of Done

MVP duoc xem la hoan thanh khi:

- Co du 600 cau trong database.
- User luyen theo chuong duoc.
- User submit dap an va xem loi giai duoc.
- Co animation cho it nhat 5 cau sa hinh mau.
- User thi thu duoc it nhat 1 hang bang.
- Co trang ket qua thi.
- Co trang on cau sai.
- Website responsive mobile.
- Backend test cac logic quan trong pass.
- Deploy duoc bang Docker Compose.
