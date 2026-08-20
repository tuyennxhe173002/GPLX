# Frontend Architecture

## Style

Frontend su dung React + TypeScript theo feature-first structure de mirror backend domains va giu practice/exam/animation tach ro contract.

## Recommended Structure

```text
frontend/src/
  app/
  shared/
  features/
    chapters/
    questions/
    practice/
    animation/
    exam/
    progress/
    bookmark/
    auth/
  pages/
  assets/
  styles/
```

## Shared Layer

- `shared/api`: API client, auth handling, API error mapping.
- `shared/components`: component dung chung that su generic.
- `shared/types`: shared primitives, not domain-specific result contracts.

## Practice Flow

- Read question data tu question APIs.
- Render answer options khong co correctness metadata.
- Submit practice answer qua `POST /api/v1/practice/answers`.
- Hien result panel va explanation sau khi submit.

## Exam Flow

- Frontend khong tu tao de tu random question APIs.
- Timer chi display `expiresAt - now`.
- Save answers qua exam answer API.
- Chi hien explanation/result sau submit/expire.

## Animation Flow

- `features/animation` chua schema types, engine va controls.
- Renderer dung SVG scene + refs + `requestAnimationFrame`.
- Khong tao component rieng cho tung cau sa hinh.
- Khong update toan bo React tree 60 lan/giay.

## State Guidance

- TanStack Query cho server state.
- Zustand hoac state local cho flow UI can cache tam thoi.
- Animation runtime state nam trong engine, khong nen dua het vao React state.

## API Contract Safety

- Practice question type khong co explanation.
- Exam question type khong co explanation.
- Animation endpoint chi duoc goi khi backend cho phep.
