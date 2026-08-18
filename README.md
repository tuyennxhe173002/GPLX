# GPLX 600 Questions

Website luyen 600 cau ly thuyet GPLX bang Spring Boot, React va PostgreSQL.

## Phase 1 - Run Locally

Start database:

```bash
docker compose up -d postgres
```

Docker Desktop must be running before using Docker commands on Windows.

Start backend:

```bash
cd backend
./mvnw spring-boot:run
```

Neu khong co Maven Wrapper, dung Maven local:

```bash
cd backend
mvn spring-boot:run
```

Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
Frontend: http://localhost:5173
Backend health: http://localhost:8080/api/health
```

## Environment

Backend env example:

```text
backend/.env.example
```

Frontend env example:

```text
frontend/.env.example
```
