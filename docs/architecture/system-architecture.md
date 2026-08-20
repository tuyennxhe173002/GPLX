# System Architecture

## Overview

GPLX la mot web app monorepo gom frontend React + TypeScript, backend Spring Boot modular monolith va PostgreSQL. Kien truc nay du cho MVP va phu hop hon microservice voi domain 600 cau hoi, thi thu va progress.

## High-Level Diagram

```text
                 +--------------------------+
                 |  React / TypeScript UI   |
                 |                          |
                 |  Practice                |
                 |  Exam                    |
                 |  Progress                |
                 |  Animation Engine        |
                 +------------+-------------+
                              |
                           REST/JSON
                              |
                 +------------v-------------+
                 |  Spring Boot Monolith    |
                 |                          |
                 |  Chapter                 |
                 |  Question                |
                 |  Practice                |
                 |  Animation               |
                 |  Exam                    |
                 |  Progress                |
                 |  Bookmark                |
                 |  Auth                    |
                 |  Seed                    |
                 +------------+-------------+
                              |
                        JPA / SQL / JSONB
                              |
                 +------------v-------------+
                 |       PostgreSQL         |
                 |                          |
                 |  Question Banks          |
                 |  Animations JSONB        |
                 |  Exam Sessions           |
                 |  User Progress           |
                 +--------------------------+
```

## Architectural Decisions

- Modular monolith thay vi microservice.
- Feature-first package structure o backend va frontend.
- Question bank versioning ngay tu persistence layer.
- Explanation animation la data-driven engine, khong hard-code theo tung cau.
- API safety first: khong lam lo dap an, explanation hay animation solution sai thoi diem.

## Major Flows

### Practice

1. Frontend goi read API de lay question.
2. Backend tra question data khong co answer correctness/explanation.
3. User submit qua `POST /api/v1/practice/answers`.
4. Backend cham bai, cap nhat progress neu can, tra explanation va quyen lay animation.

### Exam

1. Frontend goi `POST /api/v1/exams`.
2. Backend resolve exam profile va tao de tren server.
3. User luu dap an tung cau qua answer API.
4. Backend submit/expire va cham ket qua tren server.
5. Frontend chi xem explanation sau khi exam ket thuc.

### Question Bank Evolution

1. Seed import `manifest.json` + dataset files.
2. Backend tao hoac cap nhat `question_bank_versions`.
3. Cac question/answer/animation duoc scope theo bank version.
4. Progress va lich su exam khong bi vo khi co bank moi.
