# Phase 7 - Explanation Animation Contract And Engine

## Objective

Chot schema animation explanation va xay reusable engine cho cac cau sa hinh ma khong leak dap an truoc luc user xem ket qua.

## Backend Access Rule

- Practice mode: animation explanation chi duoc lay sau `POST /api/v1/practice/answers`.
- Exam mode: animation explanation chi duoc lay sau khi exam `SUBMITTED` hoac `EXPIRED`.
- Khong dung `GET /api/v1/questions/{id}/animation` de tra explanation animation truoc.

## Frontend Engine State

```ts
export type AnimationState = "idle" | "playing" | "paused" | "ended";
```

## Animation JSON Contract

```json
{
  "schemaVersion": 1,
  "viewport": {
    "width": 1200,
    "height": 800
  },
  "durationMs": 8000,
  "background": {
    "image": "/assets/scenes/q501.svg"
  },
  "actors": [
    {
      "id": "car-red",
      "type": "VEHICLE",
      "asset": "/assets/vehicles/car-red.svg",
      "width": 90,
      "height": 45,
      "initial": {
        "x": 300,
        "y": 500,
        "rotation": -90
      }
    }
  ],
  "tracks": [
    {
      "actorId": "car-red",
      "keyframes": [
        {
          "timeMs": 0,
          "x": 300,
          "y": 500,
          "rotation": -90
        },
        {
          "timeMs": 2500,
          "x": 300,
          "y": 350,
          "rotation": -90
        }
      ]
    }
  ],
  "events": [
    {
      "timeMs": 3000,
      "type": "HIGHLIGHT",
      "target": "car-red"
    },
    {
      "timeMs": 3500,
      "type": "SHOW_LABEL",
      "text": "Xe nay duoc quyen di truoc"
    }
  ]
}
```

## Tasks

Backend implementation phai tuan thu `docs/backend-monolith-structure.md`.

1. Backend tao entity `ExplanationAnimation` trong `animation/entity`.
2. Backend tao repository trong `animation/repository`.
3. Backend tao DTO response trong `animation/dto/response`.
4. Backend tao validator schema trong `animation/validation`.
5. Backend tao service interface trong `animation/service`.
6. Backend tao service implementation trong `animation/service/impl`.
7. Backend tao API lay animation tu practice attempt hoac exam result, khong lay truc tiep tu question.
8. Frontend tao `TrafficScene`.
9. Frontend tao `AnimationControls`.
10. Frontend tao `AnimationEngine`, `Timeline`, `interpolate` va schema types.
11. Implement `play()`, `pause()`, `replay()`, `seek(ms)`, `setSpeed()`.
12. Implement render bang SVG + `requestAnimationFrame`.
13. Khong dung `setInterval(...)` cho animation loop.
14. Khong buoc React rerender toan scene 60 lan/giay; cap nhat transform qua refs/engine.
15. Implement event overlay cho highlight va label explanation.

## Success Criteria

- Schema animation duoc chot va validate duoc.
- Scene render duoc background, actor, track va explanation events.
- Xe chay dung theo keyframes va duration.
- User co the replay va doi toc do.
- Backend khong leak explanation animation truoc khi cham bai.
