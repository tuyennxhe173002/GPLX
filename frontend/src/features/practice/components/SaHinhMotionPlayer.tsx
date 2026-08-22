import { useState, useEffect, useMemo } from "react";
import type { SaHinhSimulationConfig, VehicleSimulationState } from "../data/saHinhSimulationData";

type Props = {
  config: SaHinhSimulationConfig;
};

export function SaHinhMotionPlayer({ config }: Props) {
  const maxSteps = useMemo(() => {
    return Math.max(...config.vehicles.map((v) => v.stepOrder), 1);
  }, [config.vehicles]);

  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = start (all at initial), 1..maxSteps = animating
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto step timer when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxSteps) {
          return 0; // loop back or pause
        }
        return prev + 1;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isPlaying, maxSteps]);

  // Restart / Replay
  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // Get active vehicle moving in current step
  const activeVehicles = useMemo(() => {
    return config.vehicles.filter((v) => v.stepOrder === currentStep);
  }, [config.vehicles, currentStep]);

  // Calculate transform for vehicle movement
  const getVehicleTransform = (v: VehicleSimulationState) => {
    const hasMoved = currentStep >= v.stepOrder;
    const isMovingNow = currentStep === v.stepOrder;

    if (!hasMoved) {
      // At initial station
      switch (v.startPosition) {
        case "bottom":
          return "translate(180px, 280px)";
        case "top":
          return "translate(180px, 40px) rotate(180deg)";
        case "left":
          return "translate(40px, 180px) rotate(90deg)";
        case "right":
          return "translate(280px, 180px) rotate(-90deg)";
      }
    }

    // Has moved or moving
    switch (v.startPosition) {
      case "bottom":
        if (v.direction === "turn_right") return "translate(300px, 200px) rotate(90deg)";
        if (v.direction === "turn_left") return "translate(60px, 160px) rotate(-90deg)";
        return "translate(180px, 20px)"; // straight
      case "top":
        if (v.direction === "turn_right") return "translate(60px, 160px) rotate(-90deg)";
        if (v.direction === "turn_left") return "translate(300px, 200px) rotate(90deg)";
        return "translate(180px, 300px) rotate(180deg)"; // straight
      case "left":
        if (v.direction === "turn_right") return "translate(160px, 60px) rotate(0deg)";
        if (v.direction === "turn_left") return "translate(200px, 300px) rotate(180deg)";
        return "translate(300px, 180px) rotate(90deg)"; // straight
      case "right":
        if (v.direction === "turn_right") return "translate(200px, 300px) rotate(180deg)";
        if (v.direction === "turn_left") return "translate(160px, 60px) rotate(0deg)";
        return "translate(20px, 180px) rotate(-90deg)"; // straight
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-b from-slate-900 via-[#0a192f] to-slate-900 p-4 sm:p-5 text-white shadow-xl space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="text-xs sm:text-sm font-extrabold text-sky-300">
            {config.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-xl border border-slate-600 bg-slate-800/80 px-2.5 py-1 font-bold text-slate-200 transition hover:bg-slate-700"
          >
            {isPlaying ? "⏸ Tạm dừng" : "▶ Chạy tiếp"}
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="rounded-xl border border-sky-600 bg-sky-600/30 px-2.5 py-1 font-bold text-sky-200 transition hover:bg-sky-600/50"
          >
            🔄 Xem lại
          </button>
        </div>
      </div>

      {/* Interactive 2D Intersection Motion Canvas */}
      <div className="relative mx-auto h-[320px] w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-inner flex items-center justify-center">
        <svg viewBox="0 0 360 360" className="h-full w-full select-none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Grass / Ground */}
          <rect width="360" height="360" fill="#0f172a" />
          <rect x="0" y="0" width="130" height="130" fill="#14532d" rx="12" />
          <rect x="230" y="0" width="130" height="130" fill="#14532d" rx="12" />
          <rect x="0" y="230" width="130" height="130" fill="#14532d" rx="12" />
          <rect x="230" y="230" width="130" height="130" fill="#14532d" rx="12" />

          {/* Roads */}
          <rect x="130" y="0" width="100" height="360" fill="#334155" />
          <rect x="0" y="130" width="360" height="100" fill="#334155" />

          {/* Road Markings (Zebra & Dashes) */}
          {/* Vertical Dashes */}
          <line x1="180" y1="10" x2="180" y2="120" stroke="#facc15" strokeWidth="3" strokeDasharray="8 6" />
          <line x1="180" y1="240" x2="180" y2="350" stroke="#facc15" strokeWidth="3" strokeDasharray="8 6" />
          {/* Horizontal Dashes */}
          <line x1="10" y1="180" x2="120" y2="180" stroke="#facc15" strokeWidth="3" strokeDasharray="8 6" />
          <line x1="240" y1="180" x2="350" y2="180" stroke="#facc15" strokeWidth="3" strokeDasharray="8 6" />

          {/* Center Intersection Box */}
          <rect x="130" y="130" width="100" height="100" fill="#1e293b" opacity="0.6" stroke="#475569" strokeDasharray="4 4" />

          {/* Stop Lines */}
          <line x1="130" y1="235" x2="230" y2="235" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
          <line x1="130" y1="125" x2="230" y2="125" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
          <line x1="125" y1="130" x2="125" y2="230" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
          <line x1="235" y1="130" x2="235" y2="230" stroke="#ffffff" strokeWidth="3" opacity="0.8" />

          {/* Roundabout Island if applicable */}
          {config.junctionType === "roundabout" ? (
            <circle cx="180" cy="180" r="32" fill="#15803d" stroke="#facc15" strokeWidth="3" />
          ) : null}
        </svg>

        {/* Animated Vehicles on Top */}
        <div className="absolute inset-0 pointer-events-none">
          {config.vehicles.map((v) => {
            const isMoving = currentStep === v.stepOrder;
            const hasPassed = currentStep > v.stepOrder;

            return (
              <div
                key={v.id}
                style={{
                  transform: getVehicleTransform(v),
                  transition: isMoving ? "transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                }}
                className="absolute left-0 top-0 flex flex-col items-center justify-center will-change-transform z-20"
              >
                {/* Vehicle Body Card */}
                <div
                  style={{ backgroundColor: v.color }}
                  className={`relative flex h-11 w-8 items-center justify-center rounded-lg shadow-lg border border-white/40 text-[9px] font-black text-white transition-all ${
                    isMoving ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110" : ""
                  }`}
                >
                  {/* Windshield */}
                  <div className="absolute top-1 h-2 w-6 rounded bg-slate-900/60"></div>

                  {/* Siren for Emergency Vehicles */}
                  {v.type === "police" || v.type === "fire_truck" || v.type === "ambulance" ? (
                    <div className="absolute -top-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                  ) : null}

                  {/* Vehicle Label Initial */}
                  <span className="mt-1 text-[8px] uppercase tracking-tighter drop-shadow">
                    {v.name.split(" ")[1] || v.name.slice(0, 3)}
                  </span>
                </div>

                {/* Name Badge */}
                <span className="mt-1 rounded bg-slate-900/90 px-1 py-0.5 text-[8px] font-bold text-slate-200 shadow whitespace-nowrap">
                  {v.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Sequence Badges */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {Array.from({ length: maxSteps }, (_, i) => i + 1).map((stepNum) => {
            const isCurrent = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            const stepVehicles = config.vehicles.filter((v) => v.stepOrder === stepNum);

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  setCurrentStep(stepNum);
                  setIsPlaying(false);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300 scale-105"
                    : isDone
                    ? "bg-emerald-800/60 text-emerald-200 border border-emerald-600/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                Bước {stepNum}: {stepVehicles.map((v) => v.name).join(" + ")}
              </button>
            );
          })}
        </div>

        {/* Active Step Explanation Box */}
        <div className="rounded-2xl border border-sky-800/40 bg-sky-950/40 p-3 text-xs space-y-1">
          <p className="font-extrabold text-amber-300">
            {currentStep === 0
              ? "👉 Bấm [▶ Chạy tiếp] hoặc chọn các bước để xem thứ tự xe di chuyển."
              : `👉 Bước ${currentStep}: ${activeVehicles.map((v) => `${v.name} (${v.ruleReason})`).join(", ")}`}
          </p>
          <p className="text-slate-300 text-[11px] font-medium leading-relaxed">
            {config.ruleSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
