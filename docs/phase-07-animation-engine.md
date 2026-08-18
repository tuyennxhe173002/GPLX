# Phase 7 - Animation Engine MVP

## Objective

Hien thi xe chuyen dong theo JSON animation cho cau sa hinh.

## Frontend Types

```ts
export type Point = { x: number; y: number };

export type VehicleAnimation = {
  id: string;
  type: "car" | "truck" | "bus" | "motorbike";
  label: string;
  start: { x: number; y: number; rotation: number };
  path: Point[];
  startTimeMs: number;
  durationMs: number;
  isCorrect: boolean;
};

export type ExplanationAnimationData = {
  vehicles: VehicleAnimation[];
  steps: Array<{
    timeMs: number;
    title?: string;
    description: string;
    vehicleId?: string;
  }>;
  correctVehicleIds: string[];
};
```

## Tasks

1. Backend tao entity `ExplanationAnimation`.
2. Backend tao API `GET /api/questions/{id}/animation`.
3. Frontend tao `AnimatedScene`.
4. Frontend tao `VehicleSprite`.
5. Frontend tao `useScenePlayer`.
6. Implement Play, Pause, Replay, Speed.
7. Implement path interpolation.
8. Tinh rotation theo huong di giua 2 diem.
9. Highlight xe dung.
10. Hien timeline step tuong ung current time.

## Success Criteria

- Scene render duoc background.
- Xe chay dung theo path.
- Start time va duration tung xe duoc ton trong.
- User co the replay animation.
