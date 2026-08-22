# GPLX 600 Questions

Website luyen 600 cau ly thuyet GPLX bang Spring Boot, React va PostgreSQL.

## Local Development

Recommended local workflow:

- PostgreSQL runs in Docker.
- Backend runs directly in IntelliJ with Maven Wrapper.
- Frontend runs directly in VS Code or Visual Studio Code with Vite.

### 1. Start only the database in Docker

```bash
docker compose -f docker-compose.db.yml up -d
```

Docker Desktop must be running before using Docker commands on Windows.

Default local database settings:

- Host: `127.0.0.1`
- Port: `5433`
- Database: `gplx`
- Username: `gplx`
- Password: `gplx`

Reason for `5433`:

- Your machine already has a local `postgres` process listening on `5432`.
- Docker DB is intentionally exposed on `5433` so backend local does not connect to the wrong PostgreSQL instance.

### 2. Run backend locally in IntelliJ

Open `backend/` as a Maven project in IntelliJ.

Shared IntelliJ run configuration is included in:

```text
.run/Backend Local.run.xml
```

The repo now includes Maven Wrapper:

```text
backend/mvnw
backend/mvnw.cmd
```

If IntelliJ asks which Maven to use, choose:

- Maven Wrapper
- Project SDK: Java 21

Set active profile for local development:

- `SPRING_PROFILES_ACTIVE=local`

Run options for backend:

- Main class: `com.example.gplx.GplxApplication`
- Working directory: `backend`

If you use the shared `.run` config, you can usually just click `Backend Local` and run.

You can also run backend from terminal without installing Maven globally:

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

On PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Or use the one-command helper script:

```powershell
cd backend
.\run-local.ps1
```

The script will:

- resolve a valid local JDK,
- set `JAVA_HOME`,
- verify PostgreSQL Docker is reachable on `127.0.0.1:5433`,
- run backend with Maven Wrapper.

Backend local profile points to Docker PostgreSQL on port `5433`:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5433/gplx
SPRING_DATASOURCE_USERNAME=gplx
SPRING_DATASOURCE_PASSWORD=gplx
```

Check backend health:

```bash
curl http://localhost:8080/api/health
```

### 3. Run frontend locally in VS Code

Open `frontend/` in Visual Studio Code.

Install dependencies and start Vite:

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

Frontend local proxy is already configured to call backend on `http://localhost:8080` for `/api` requests.

## Environment

Backend env example:

```text
backend/.env.example
backend/.env.local.example
```

Frontend env example:

```text
frontend/.env.example
```

For local development, `frontend/.env.example` can stay empty because Vite proxy already forwards `/api` to `http://localhost:8080`.

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
