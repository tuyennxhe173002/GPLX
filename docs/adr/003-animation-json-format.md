# ADR 003 - Animation JSON Format

## Status

Accepted

## Context

Project can explanation animation cho nhieu cau sa hinh. Hard-code component rieng cho tung cau se kho maintain va kho test.

## Decision

Su dung SVG scene + JSON timeline versioned, luu payload trong PostgreSQL JSONB va render bang reusable frontend engine.

## Consequences

- Frontend co mot renderer chung cho nhieu cau.
- Backend can validator schema.
- Contract animation phai chot som truoc khi nhap du lieu hang loat.
