# ADR 002 - Question Bank Versioning

## Status

Accepted

## Context

Bo cau hoi GPLX co the thay doi theo quy dinh moi. Neu he thong coi `question_number` la unique vinh vien thi progress, bookmarks va exam history se de vo khi dataset thay doi.

## Decision

Them `question_bank_versions` va scope business key theo `question_bank_version_id + question_number`.

## Consequences

- Ho tro nhieu bo cau hoi theo thoi gian.
- Import/seed can them manifest va active-version resolution.
- Progress va exam history co the giu on dinh khi co bank moi.
