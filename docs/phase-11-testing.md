# Phase 11 - Testing And Quality Gate

## Objective

Dam bao logic data, cham diem, exam va animation on dinh.

## Backend Test Cases

1. Seed `FULL` validate dung theo manifest.
2. Seed `PARTIAL` cho phep dataset con nhung van reject data vo integrity.
3. Cau hoi khong expose `isCorrect` hoac `explanation`.
4. Submit answer dung.
5. Submit answer sai.
6. Reject answer khong thuoc question.
7. Exam pass khi du diem va khong sai diem liet.
8. Exam fail khi sai cau diem liet.
9. Exam answer save API khong tra dung/sai truoc submit.
10. Explanation animation chi truy cap duoc theo practice attempt hoac exam da ket thuc.

## Frontend Test Cases

1. Render danh sach chuong.
2. Render cau hoi.
3. Chon dap an.
4. Submit va hien loi giai.
5. Animation button/panel chi hien sau practice result hoac exam result hop le.
6. Play animation.
7. Replay animation.
8. Timer exam.
9. Result page.

## Success Criteria

- Backend tests pass.
- Frontend build pass.
- Manual smoke test pass tren Chrome va mobile viewport.
