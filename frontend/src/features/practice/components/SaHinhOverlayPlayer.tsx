import { useState, useEffect, useMemo } from "react";
import { getSaHinhSimulation, type VehicleSimulationState } from "../data/saHinhSimulationData";

type Props = {
  imageUrl?: string | null;
  questionNumber: number;
  content: string;
  explanation?: string | null;
};

export function SaHinhOverlayPlayer({ imageUrl, questionNumber, content, explanation }: Props) {
  const simulation = useMemo(() => {
    return getSaHinhSimulation(questionNumber, content, explanation);
  }, [questionNumber, content, explanation]);

  const maxSteps = useMemo(() => {
    if (!simulation) return 1;
    return Math.max(...simulation.vehicles.map((v) => v.stepOrder), 1);
  }, [simulation]);

  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = start/all in place, 1..maxSteps = vehicle moving
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying || !simulation) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxSteps) {
          return 0; // loop
        }
        return prev + 1;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlaying, maxSteps, simulation]);

  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  if (!simulation) return null;

  const activeVehicles = simulation.vehicles.filter((v) => v.stepOrder === currentStep);

  // Isometric translation vectors for perspective simulation on the question image
  const getVehicleOverlayStyle = (v: VehicleSimulationState) => {
    const isMoving = currentStep === v.stepOrder;
    const hasPassed = currentStep > v.stepOrder;

    // Base coordinates according to approach side on the image
    let initialX = 50;
    let initialY = 50;
    let targetX = 50;
    let targetY = 50;

    switch (v.startPosition) {
      case "bottom": // bottom right car / truck
        initialX = 72;
        initialY = 65;
        if (v.direction === "turn_left") {
          targetX = 25;
          targetY = 22;
        } else if (v.direction === "turn_right") {
          targetX = 85;
          targetY = 82;
        } else {
          targetX = 45;
          targetY = 20;
        }
        break;
      case "left": // bottom left blue car
        initialX = 18;
        initialY = 62;
        if (v.direction === "straight") {
          targetX = 75;
          targetY = 32;
        } else if (v.direction === "turn_left") {
          targetX = 42;
          targetY = 22;
        } else {
          targetX = 12;
          targetY = 80;
        }
        break;
      case "top": // top left motorbike
        initialX = 28;
        initialY = 25;
        if (v.direction === "turn_left") {
          targetX = 75;
          targetY = 65;
        } else if (v.direction === "turn_right") {
          targetX = 15;
          targetY = 35;
        } else {
          targetX = 45;
          targetY = 75;
        }
        break;
      case "right": // top right bus
        initialX = 70;
        initialY = 22;
        if (v.direction === "turn_right") {
          targetX = 75;
          targetY = 35;
        } else if (v.direction === "turn_left") {
          targetX = 20;
          targetY = 65;
        } else {
          targetX = 22;
          targetY = 65;
        }
        break;
    }

    const currentX = currentStep >= v.stepOrder ? targetX : initialX;
    const currentY = currentStep >= v.stepOrder ? targetY : initialY;

    return {
      left: `${currentX}%`,
      top: `${currentY}%`,
      transition: isMoving ? "all 1.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
      opacity: hasPassed ? 0.35 : 1,
    };
  };

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-slate-900 via-[#0a192f] to-slate-900 p-4 sm:p-6 text-white shadow-2xl space-y-4">
      {/* Top Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-300">
              🎬 MÔ PHỎNG CHUYỂN ĐỘNG PHƯƠNG TIỆN SA HÌNH
            </h3>
            <p className="text-[11px] text-slate-300 font-medium">{simulation.title}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 shadow-sm"
          >
            {isPlaying ? "⏸ Tạm dừng" : "▶ Chạy chuyển động"}
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="rounded-xl border border-amber-500 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/40 shadow-sm"
          >
            🔄 Xem lại
          </button>
        </div>
      </div>

      {/* Main Image Overlay Simulation Stage */}
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-950 shadow-2xl select-none">
        {/* Actual Question Image with Isometric Scene */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Sa hình câu ${questionNumber}`}
            className="w-full object-contain max-h-[380px] mx-auto opacity-90"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            Đang tải hình ảnh sa hình...
          </div>
        )}

        {/* Animated Moving Vehicle Sprites on Top of Actual Image */}
        <div className="absolute inset-0 pointer-events-none">
          {simulation.vehicles.map((v) => {
            const isMoving = currentStep === v.stepOrder;
            const style = getVehicleOverlayStyle(v);

            return (
              <div
                key={v.id}
                style={style}
                className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform z-30 flex flex-col items-center"
              >
                {/* Vehicle Marker Badge */}
                <div
                  style={{ backgroundColor: v.color }}
                  className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-black text-white shadow-2xl border-2 border-white transition-all ${
                    isMoving
                      ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-125 shadow-amber-500/50"
                      : ""
                  }`}
                >
                  {/* Siren if emergency */}
                  {v.type === "police" || v.type === "fire_truck" || v.type === "ambulance" ? (
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-ping"></span>
                  ) : null}

                  <span>🚗</span>
                  <span className="drop-shadow">{v.name}</span>
                </div>

                {/* Dynamic Direction Arrow Indicator */}
                {isMoving ? (
                  <div className="mt-1 flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 animate-bounce shadow">
                    <span>ĐANG CHẠY ➔</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Sequence Timeline */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: maxSteps }, (_, i) => i + 1).map((stepNum) => {
            const isCurrent = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            const stepVehicles = simulation.vehicles.filter((v) => v.stepOrder === stepNum);

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  setCurrentStep(stepNum);
                  setIsPlaying(false);
                }}
                className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${
                  isCurrent
                    ? "bg-amber-400 text-slate-950 ring-4 ring-amber-300/60 shadow-lg scale-105"
                    : isDone
                    ? "bg-emerald-700/80 text-emerald-100 border border-emerald-500/50"
                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                Bước {stepNum}: {stepVehicles.map((v) => v.name).join(" + ")}
              </button>
            );
          })}
        </div>

        {/* Theoretical Rule Explanation Box */}
        <div className="rounded-2xl border border-sky-800/60 bg-sky-950/60 p-4 text-xs space-y-1.5">
          <div className="font-extrabold text-amber-300 text-xs sm:text-sm">
            {currentStep === 0
              ? "👉 Bấm [▶ Chạy chuyển động] hoặc chọn từng Bước để xem phương tiện chạy đúng luật."
              : `👉 Bước ${currentStep}: ${activeVehicles.map((v) => `${v.name} (${v.ruleReason})`).join(", ")}`}
          </div>
          <p className="text-slate-300 text-xs font-medium leading-relaxed">
            {simulation.ruleSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
