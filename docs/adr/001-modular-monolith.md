# ADR 001 - Modular Monolith

## Status

Accepted

## Context

Du an GPLX can phuc vu question bank, practice, exam, animation, auth va progress. Quy mo domain vua phai, can transaction ro rang va deployment don gian.

## Decision

Su dung Spring Boot modular monolith thay vi microservice.

## Consequences

- Don gian hon trong transaction va exam submission flow.
- It deployment complexity hon.
- Van giu duoc separation nho feature packages va docs contract.
