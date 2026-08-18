# Phase 3 - Data Import And Validation

## Objective

Import 600 cau hoi co dinh tu JSON vao PostgreSQL va validate data truoc khi app san sang phuc vu.

## Source Files

```text
backend/src/main/resources/data/chapters.json
backend/src/main/resources/data/questions.json
backend/src/main/resources/data/animations.json
```

## Tasks

1. Tao DTO `ChapterImportDto`.
2. Tao DTO `QuestionImportDto`.
3. Tao DTO `AnswerImportDto`.
4. Tao DTO `AnimationImportDto`.
5. Tao `DataImportRunner implements CommandLineRunner`.
6. Them config `app.seed.enabled=true`.
7. Neu `questionRepository.count() >= 600` thi skip import.
8. Import chapters truoc.
9. Import questions va answers.
10. Import animations theo `questionNumber`.
11. Validate co dung 600 cau.
12. Validate question number tu 1 den 600 va khong trung.
13. Validate moi cau co tu 2 den 4 dap an.
14. Validate moi cau co dung 1 dap an dung.
15. Validate chapter code hop le.
16. Validate `hasAnimation=true` thi ton tai animation.

## Success Criteria

- App dung start neu data loi.
- App start thanh cong neu data hop le.
- Database co du 600 cau sau import.
