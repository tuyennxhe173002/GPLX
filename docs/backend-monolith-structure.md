# Backend Monolith Structure Standard

## Objective

Backend GPLX la Spring Boot modular monolith. Tat ca code backend phai duoc chia theo feature package va layer ro rang, de giu contract API, business rule va persistence tach biet.

## Root Package

```text
backend/src/main/java/com/example/gplx/
```

## Required Package Layout

```text
com/example/gplx/
  configuration/
  common/
    controller/
    dto/
    exception/
    response/
    util/
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

Moi feature/domain phai theo cau truc:

```text
com/example/gplx/<feature>/
  controller/
  dto/
    request/
    response/
  entity/
  mapper/
  repository/
  service/
    impl/
```

## Configuration Package

Tat ca cau hinh dung chung dat trong:

```text
com/example/gplx/configuration/
```

Vi du:

```text
configuration/SecurityConfig.java
configuration/CorsConfig.java
configuration/JacksonConfig.java
configuration/OpenApiConfig.java
```

Khong tao package moi ten `config`. Neu da co code cu trong `config`, phai migrate sang `configuration` truoc khi them config moi.

## Layer Rules

### Entity

- Dat trong `<feature>/entity`.
- Chi mo ta persistence model va JPA mapping.
- Khong expose entity truc tiep qua API.
- Khong dat business logic phuc tap trong entity.

### Repository

- Dat trong `<feature>/repository`.
- Chi truy cap database.
- Khong map DTO trong repository.
- Khong dat rule thi, rule cham bai, hay rule tien do trong repository.

### Service

- Dat interface trong `<feature>/service`.
- Dat implementation trong `<feature>/service/impl`.
- Controller chi inject service interface, khong inject repository.
- Service chua business logic, transaction boundary va orchestration.
- Dat `@Transactional` o service implementation khi can ghi du lieu.

### Controller

- Dat trong `<feature>/controller`.
- Chi nhan request, validate input, goi service va tra DTO.
- Khong goi repository truc tiep.
- Khong tu cham bai trong controller.

### DTO

- Request DTO dat trong `<feature>/dto/request`.
- Response DTO dat trong `<feature>/dto/response`.
- DTO dung Java `record` neu khong can behavior.
- DTO response phai on dinh contract API, khong reuse entity.
- Khong dung mot `QuestionResponse` cho tat ca mode practice, exam va result.

### Mapper

- Dat trong `<feature>/mapper`.
- Mapper chiu trach nhiem convert entity sang DTO va nguoc lai neu can.
- Khong nhan repository trong mapper.
- Khong dat business rule trong mapper.

## Dependency Direction

Luon theo huong:

```text
Controller
  -> Service interface
  -> Service implementation
  -> Repository
  -> Database
```

Mapper chi phuc vu `Entity <-> DTO`.

## API Safety Rules

- API lay cau hoi khong duoc tra `Answer.isCorrect`.
- API lay cau hoi cho practice/exam khong duoc tra `explanation`.
- Animation loi giai khong duoc tra truoc khi user submit practice answer hoac exam da `SUBMITTED/EXPIRED`.
- Chi API cham dap an moi duoc tra `correct`, `correctAnswerIds`, `explanation` va animation explanation.
- Exam answer API khong duoc tra dung/sai truoc luc submit bai.
- Khong tra password hash, internal flags, audit fields neu frontend khong can.

## Exam Rule Placement

- Khong hard-code rule thi theo hang bang trong controller/service bang chuoi `if (licenseClass.equals(...))`.
- Rule thi phai duoc resolve tu `license_exam_profiles` hoac exam rules package.
- Service exam chi doc profile, generate de, luu session va cham bai theo profile.

## Question Bank Rules

- Khong coi `question_number` la global immutable key duy nhat.
- Bat buoc ho tro `question_bank_version_id + question_number` la khoa nghiep vu.
- Dataset phai co `manifest.json` mo ta `bankCode`, `version`, `questionCount`, `criticalQuestionCount`, `effectiveFrom`, `source`.

## Seed Rules

- Seed phai ho tro `app.seed.validation-mode` voi it nhat `FULL` va `PARTIAL`.
- `FULL` dung cho production dataset va bat buoc validate day du so luong, numbering va completeness.
- `PARTIAL` dung cho local/dev/test va cho phep seed tap con, nhung van phai validate integrity co ban.

## Naming Rules

- Entity: `Question`, `Answer`, `Chapter`, `QuestionBankVersion`, `ExamSession`.
- Repository: `QuestionRepository`.
- Service interface: `QuestionService`.
- Service implementation: `QuestionServiceImpl`.
- Controller: `QuestionController`.
- Mapper: `QuestionMapper`.
- Practice request DTO: `SubmitPracticeAnswerRequest`.
- Practice response DTO: `PracticeAnswerResult`.

## Required Question DTO Split

Backend phai tach it nhat cac response sau:

- `QuestionSummaryResponse`
- `PracticeQuestionResponse`
- `PracticeAnswerResult`
- `ExamQuestionResponse`
- `ExamResultQuestionResponse`

Khong gom tat ca vao mot `QuestionResponse` duy nhat.

## Phase Implementation Requirement

Tu phase tiep theo, moi task backend phai:

1. Tao dung folder theo feature package.
2. Tao service interface va service implementation rieng.
3. Tao mapper rieng neu co DTO response/request mapping.
4. Controller chi lam HTTP boundary.
5. Khong expose entity truc tiep.
6. Khong lam lo dap an, explanation hoac explanation animation sai thoi diem.
7. Cap nhat docs neu them package, rule hoac contract moi.
