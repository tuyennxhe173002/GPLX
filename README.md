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

Production env example:

```text
.env.prod.example
```

## Seed 600 Questions

Question data files live in:

```text
backend/src/main/resources/data/chapters.json
backend/src/main/resources/data/questions.json
backend/src/main/resources/data/animations.json
```

`questions.json` is intentionally empty until the official 600-question dataset is added. To import data, replace `questions.json` with exactly 600 validated questions, add optional animations to `animations.json`, then run backend with seed enabled:

Example formats are available at:

```text
backend/src/main/resources/data/questions.example.json
backend/src/main/resources/data/animations.example.json
```

```bash
APP_SEED_ENABLED=true docker compose up backend
```

On PowerShell:

```powershell
$env:APP_SEED_ENABLED="true"; docker compose up backend
```

The importer fails fast if the dataset is not exactly 600 questions, has duplicate question numbers, has invalid chapter codes, or any question does not have exactly one correct answer.

## Production Deploy

Production artifacts:

```text
backend/Dockerfile
frontend/Dockerfile
infra/nginx/default.conf
docker-compose.prod.yml
```

1. Create a production env file from the example.

```bash
cp .env.prod.example .env.prod
```

2. Edit `.env.prod` and set at least:

```text
POSTGRES_PASSWORD
APP_AUTH_JWT_SECRET
APP_CORS_ALLOWED_ORIGIN
```

3. Start the production stack.

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

4. Check container health.

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
```

5. Smoke test the deployment.

```bash
curl http://localhost:${FRONTEND_PORT:-80}
curl http://localhost:${BACKEND_PORT:-8080}/api/health
```

Production notes:

- `frontend` serves the Vite build via Nginx and proxies `/api` to `backend`.
- `postgres_data` is a named volume, so container restarts do not wipe database state.
- `restart: unless-stopped` is enabled for all production services.
- `backend` and `frontend` both have healthchecks; `frontend` waits for a healthy backend before starting.
- HTTPS is still expected to be terminated by an upstream reverse proxy or load balancer in front of this stack.
