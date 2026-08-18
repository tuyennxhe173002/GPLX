# GPLX 600 Questions

Website luyen 600 cau ly thuyet GPLX bang Spring Boot, React va PostgreSQL.

## Phase 1 - Run Locally

Start database:

```bash
docker compose up -d postgres
```

Docker Desktop must be running before using Docker commands on Windows.

Start backend without installing Java/Maven locally:

```bash
docker compose up backend
```

The command above is recommended on Windows when `mvn` is not recognized.

Start backend with Maven local if Java 21 and Maven are installed:

```bash
cd backend
mvn spring-boot:run
```

PowerShell note: if a Maven Wrapper is added later, run it as `./mvnw.cmd` or `./mvnw`, not `mvnw`.

Check backend health:

```bash
curl http://localhost:8080/api/health
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
