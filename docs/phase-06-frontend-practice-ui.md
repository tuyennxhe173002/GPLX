# Phase 6 - Frontend Practice UI

## Objective

Tao UI luyen cau hoi theo chuong, submit dap an, xem loi giai va chi mo explanation animation sau khi practice answer da duoc cham.

## Pages

```text
/
/chapters
/chapters/:chapterId/practice
/practice/random
```

## Components

```text
QuestionCard
AnswerOption
ExplanationPanel
QuestionNavigator
ChapterCard
```

## Tasks

1. Setup router.
2. Setup TanStack Query.
3. Tao API modules cho question read APIs va `POST /api/v1/practice/answers`.
4. Tao layout chung.
5. Tao Home page.
6. Tao Chapter list page.
7. Tao Practice page.
8. Render cau hoi, anh va dap an ma khong can correctness metadata tu read API.
9. Submit dap an.
10. Highlight dung/sai sau submit theo `PracticeAnswerResult`.
11. Hien loi giai sau submit.
12. Neu response cho phep animation, hien nut/panel de lay explanation animation theo attempt.

## Success Criteria

- User luyen cau hoi duoc tren desktop va mobile.
- Dap an dung/sai hien ro rang sau submit.
- UI khong the xem explanation animation truoc khi co result practice.
- UI khong can reload trang khi chuyen cau.
