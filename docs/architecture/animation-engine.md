# Animation Engine Architecture

## Goal

Xay reusable explanation animation engine cho cac cau sa hinh bang du lieu JSON versioned, thay vi hard-code mot component cho tung cau.

## Rendering Choice

SVG duoc uu tien cho version dau vi:

- sac net voi road/sign assets,
- de highlight actor,
- responsive,
- de debug,
- du complexity cho 115 cau sa hinh.

## Runtime Model

```ts
type AnimationState = "idle" | "playing" | "paused" | "ended";
```

Engine API mong muon:

```ts
play()
pause()
replay()
seek(ms)
setSpeed(0.5 | 1 | 1.5 | 2)
```

## Loop

```text
requestAnimationFrame
  -> currentTime
  -> current keyframe segment
  -> interpolate x/y/rotation
  -> apply SVG transform
  -> render explanation events
```

Khong dung `setInterval(...)` cho animation loop.

## JSON Contract

Bat buoc co:

- `schemaVersion`
- `viewport`
- `durationMs`
- `background`
- `actors`
- `tracks`
- `events`

## Backend Responsibilities

- Validate schema khi import/seed.
- Luu payload trong JSONB.
- Gate explanation animation theo practice attempt hoac exam result.

## Frontend Responsibilities

- Parse schema typed.
- Noi scene/background/assets.
- Interpolate actor motion.
- Hien highlight/label overlay.
- Bao dam replay va speed control.
