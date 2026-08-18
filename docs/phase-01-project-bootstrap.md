# Phase 1 - Project Bootstrap

## Objective

Tao skeleton Spring Boot, React va PostgreSQL de co nen tang chay duoc end-to-end.

## Backend Tasks

1. Tao project Spring Boot trong folder `backend`.
2. Chon dependencies: Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, Flyway, Lombok, Validation.
3. Dat package root: `com.example.gplx`.
4. Tao endpoint `GET /api/health` tra `{ "status": "OK" }`.
5. Cau hinh CORS cho `http://localhost:5173`.
6. Cau hinh datasource den PostgreSQL.

## Frontend Tasks

1. Tao project Vite React TypeScript trong folder `frontend`.
2. Cai React Router, TanStack Query, Zustand, Tailwind CSS.
3. Tao `src/api/http.ts`.
4. Tao Home page goi `/api/health`.

## Docker Tasks

1. Tao `docker-compose.yml` o root.
2. Them service `postgres`.
3. Dat database name `gplx`.
4. Dat user/password local.

## Success Criteria

- Backend start thanh cong.
- Frontend start thanh cong.
- Database start thanh cong.
- Frontend hien backend health status.
