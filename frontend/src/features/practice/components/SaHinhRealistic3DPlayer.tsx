import { useState, useEffect, useMemo } from "react";
import { getSaHinhSimulation } from "../data/saHinhSimulationData";

type Props = {
  questionNumber: number;
  content: string;
  explanation?: string | null;
};

export function SaHinhRealistic3DPlayer({ questionNumber, content, explanation }: Props) {
  const simulation = useMemo(() => {
    return getSaHinhSimulation(questionNumber, content, explanation);
  }, [questionNumber, content, explanation]);

  const maxSteps = useMemo(() => {
    if (!simulation) return 3;
    return Math.max(...simulation.vehicles.map((v) => v.stepOrder), 3);
  }, [simulation]);

  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = start/all waiting, 1..maxSteps = moving
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxSteps) {
          return 0; // loop back to initial
        }
        return prev + 1;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying, maxSteps]);

  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // Determine which vehicles are in this question
  const isEmergency = useMemo(() => {
    const text = (content + " " + (explanation || "")).toLowerCase();
    return text.includes("công an") || text.includes("quân sự") || text.includes("cứu hỏa") || text.includes("cứu thương");
  }, [content, explanation]);

  // Phase explanations
  const getPhaseExplanation = (step: number) => {
    if (step === 0) {
      return "👉 Bấm [▶ Chạy mô phỏng] để xem thứ tự các xe di chuyển qua ngã tư theo đúng Luật Giao Thông Đường Bộ.";
    }
    if (step === 1) {
      return isEmergency
        ? "👉 Pha 1: Xe Ưu Tiên (Cứu hỏa / Quân sự / Công an / Cứu thương) được quyền đi trước qua giao lộ."
        : "👉 Pha 1: Xe tải (rẽ phải) và Xe mô tô (đi thẳng) đang ở trên ĐƯỜNG ƯU TIÊN nên được quyền đi trước.";
    }
    if (step === 2) {
      return isEmergency
        ? "👉 Pha 2: Các xe dân sự đi sau xe ưu tiên theo thứ tự đường ưu tiên và hướng đi."
        : "👉 Pha 2: Xe khách ở trên đường không ưu tiên nhưng ĐI THẲNG nên được đi trước xe rẽ trái.";
    }
    return "👉 Pha 3: Xe con ở trên đường không ưu tiên và RẼ TRÁI nên phải nhường đường và đi sau cùng.";
  };

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-slate-900 via-[#071326] to-slate-950 p-4 sm:p-6 text-white shadow-2xl space-y-4 select-none">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
            <span className="text-xl">🎬</span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-300 tracking-tight">
              MÔ PHỎNG 3D CHUYỂN ĐỘNG PHƯƠNG TIỆN SA HÌNH
            </h3>
            <p className="text-[11px] text-slate-300 font-medium">
              Tái hiện chân thực sa hình ngã tư và thứ tự xe di chuyển theo quy tắc chuẩn Bộ GTVT
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 shadow-sm"
          >
            {isPlaying ? "⏸ Tạm dừng" : "▶ Chạy mô phỏng"}
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

      {/* 3D Isometric Intersection Scene Stage */}
      <div className="relative mx-auto aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-slate-700 bg-[#7c8793] shadow-2xl">
        <svg viewBox="0 0 800 450" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Shadows and Gradients */}
            <linearGradient id="grassGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#76a035" />
              <stop offset="100%" stopColor="#588022" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8d99a6" />
              <stop offset="100%" stopColor="#707c8a" />
            </linearGradient>
            <linearGradient id="pavementGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b4bcc6" />
              <stop offset="100%" stopColor="#98a2ad" />
            </linearGradient>
            {/* Red Trajectory Arrow Marker */}
            <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626" />
            </marker>
          </defs>

          {/* Grass Corners */}
          <polygon points="0,0 260,0 120,150 0,100" fill="url(#grassGrad)" />
          <polygon points="540,0 800,0 800,100 680,150" fill="url(#grassGrad)" />
          <polygon points="0,350 120,300 260,450 0,450" fill="url(#grassGrad)" />
          <polygon points="800,350 680,300 540,450 800,450" fill="url(#grassGrad)" />

          {/* Sidewalks / Pavement */}
          <polygon points="260,0 280,0 140,160 120,150" fill="url(#pavementGrad)" />
          <polygon points="520,0 540,0 680,150 660,160" fill="url(#pavementGrad)" />
          <polygon points="120,300 140,290 280,450 260,450" fill="url(#pavementGrad)" />
          <polygon points="680,300 660,290 520,450 540,450" fill="url(#pavementGrad)" />

          {/* Main 3D Crossroads (Road Surface) */}
          <polygon points="280,0 520,0 660,160 800,160 800,290 660,290 520,450 280,450 140,290 0,290 0,160 140,160" fill="url(#roadGrad)" />

          {/* Pedestrian Zebra Crossings */}
          {/* Top-Left Crossing */}
          <g fill="#ffffff" opacity="0.85">
            <rect x="230" y="130" width="12" height="35" transform="rotate(-35 230 130)" />
            <rect x="250" y="115" width="12" height="35" transform="rotate(-35 250 115)" />
            <rect x="270" y="100" width="12" height="35" transform="rotate(-35 270 100)" />
            <rect x="290" y="85" width="12" height="35" transform="rotate(-35 290 85)" />
          </g>
          {/* Bottom-Right Crossing */}
          <g fill="#ffffff" opacity="0.85">
            <rect x="490" y="315" width="12" height="35" transform="rotate(-35 490 315)" />
            <rect x="510" y="300" width="12" height="35" transform="rotate(-35 510 300)" />
            <rect x="530" y="285" width="12" height="35" transform="rotate(-35 530 285)" />
            <rect x="550" y="270" width="12" height="35" transform="rotate(-35 550 270)" />
          </g>
          {/* Bottom-Left Crossing */}
          <g fill="#ffffff" opacity="0.85">
            <rect x="150" y="210" width="35" height="10" transform="rotate(35 150 210)" />
            <rect x="165" y="225" width="35" height="10" transform="rotate(35 165 225)" />
            <rect x="180" y="240" width="35" height="10" transform="rotate(35 180 240)" />
            <rect x="195" y="255" width="35" height="10" transform="rotate(35 195 255)" />
          </g>
          {/* Top-Right Crossing */}
          <g fill="#ffffff" opacity="0.85">
            <rect x="570" y="145" width="35" height="10" transform="rotate(35 570 145)" />
            <rect x="585" y="160" width="35" height="10" transform="rotate(35 585 160)" />
            <rect x="600" y="175" width="35" height="10" transform="rotate(35 600 175)" />
            <rect x="615" y="190" width="35" height="10" transform="rotate(35 615 190)" />
          </g>

          {/* Yellow Dashed Centerlines */}
          <line x1="390" y1="0" x2="390" y2="100" stroke="#facc15" strokeWidth="3" strokeDasharray="12 8" />
          <line x1="410" y1="350" x2="410" y2="450" stroke="#facc15" strokeWidth="3" strokeDasharray="12 8" />
          <line x1="0" y1="225" x2="160" y2="225" stroke="#facc15" strokeWidth="3" strokeDasharray="12 8" />
          <line x1="640" y1="225" x2="800" y2="225" stroke="#facc15" strokeWidth="3" strokeDasharray="12 8" />

          {/* 3D Red Trajectory Curved Arrows on the Road */}
          {/* 1. Truck Turn Right Path (Bottom Right -> Bottom Left) */}
          <path
            d="M 580,270 Q 420,290 240,260"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            markerEnd="url(#arrowHead)"
            className={currentStep === 1 ? "stroke-amber-400 stroke-[5px]" : ""}
          />
          {/* 2. Motorbike Straight Path (Top Left -> Bottom Right) */}
          <path
            d="M 290,130 L 570,300"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            markerEnd="url(#arrowHead)"
            className={currentStep === 1 ? "stroke-amber-400 stroke-[5px]" : ""}
          />
          {/* 3. Bus Straight Path (Top Right -> Bottom Left) */}
          <path
            d="M 560,170 L 230,230"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            markerEnd="url(#arrowHead)"
            className={currentStep === 2 ? "stroke-amber-400 stroke-[5px]" : ""}
          />
          {/* 4. Car Turn Left Path (Bottom Left -> Top Left) */}
          <path
            d="M 200,270 Q 380,210 320,120"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
            markerEnd="url(#arrowHead)"
            className={currentStep === 3 ? "stroke-amber-400 stroke-[5px]" : ""}
          />

          {/* 3D Traffic Signs */}
          {/* Sign 1: Priority Yellow Triangle at Bottom-Right (Biển Giao nhau với đường không ưu tiên) */}
          <g transform="translate(580, 120)">
            {/* Pole */}
            <rect x="14" y="40" width="4" height="60" fill="#dc2626" />
            <rect x="14" y="55" width="4" height="15" fill="#ffffff" />
            <rect x="14" y="80" width="4" height="15" fill="#ffffff" />
            {/* Triangle Sign */}
            <polygon points="16,0 36,40 -4,40" fill="#facc15" stroke="#dc2626" strokeWidth="4" />
            {/* Intersection Cross Icon */}
            <line x1="16" y1="12" x2="16" y2="34" stroke="#000000" strokeWidth="3" />
            <line x1="10" y1="22" x2="22" y2="22" stroke="#000000" strokeWidth="2" />
          </g>

          {/* Sign 2: Non-Priority Inverted Triangle at Bottom-Left (Biển Giao nhau với đường ưu tiên) */}
          <g transform="translate(200, 180)">
            {/* Pole */}
            <rect x="14" y="40" width="4" height="60" fill="#dc2626" />
            <rect x="14" y="55" width="4" height="15" fill="#ffffff" />
            <rect x="14" y="80" width="4" height="15" fill="#ffffff" />
            {/* Inverted Triangle Sign */}
            <polygon points="-4,0 36,0 16,40" fill="#facc15" stroke="#dc2626" strokeWidth="4" />
          </g>
        </svg>

        {/* --- 3D MOVING VEHICLES OVERLAY --- */}

        {/* 1. XE TẢI (TRUCK) - Starts Bottom-Right, Turns Right */}
        <div
          style={{
            transform:
              currentStep >= 1
                ? "translate(180px, 240px) rotate(-15deg) scale(0.9)"
                : "translate(530px, 220px) rotate(-25deg)",
            transition: currentStep === 1 ? "transform 2.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            opacity: currentStep > 1 ? 0.35 : 1,
          }}
          className="absolute left-0 top-0 will-change-transform z-30 flex flex-col items-center"
        >
          {/* 3D Box Truck Body */}
          <div className="relative flex items-center">
            {/* Cargo Box */}
            <div className="h-16 w-32 rounded-lg bg-slate-100 border-2 border-slate-400 shadow-2xl flex items-center justify-center text-[10px] font-black text-slate-800">
              <span>XE TẢI</span>
            </div>
            {/* Cabin */}
            <div className="h-14 w-12 rounded-r-lg bg-teal-600 border-2 border-teal-800 shadow-xl flex items-center justify-center">
              <div className="h-8 w-4 bg-slate-900/60 rounded"></div>
            </div>
          </div>
          <span className="mt-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-extrabold text-teal-300 border border-teal-500 shadow">
            Xe Tải (Đường ưu tiên)
          </span>
        </div>

        {/* 2. XE MÔ TÔ (MOTORBIKE) - Starts Top-Left, Drives Straight */}
        <div
          style={{
            transform:
              currentStep >= 1
                ? "translate(580px, 310px) rotate(35deg)"
                : "translate(220px, 80px) rotate(35deg)",
            transition: currentStep === 1 ? "transform 2.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            opacity: currentStep > 1 ? 0.35 : 1,
          }}
          className="absolute left-0 top-0 will-change-transform z-30 flex flex-col items-center"
        >
          {/* 3D Motorbike Rider */}
          <div className="relative flex flex-col items-center">
            {/* Helmet */}
            <div className="h-5 w-5 rounded-full bg-red-600 border border-white shadow"></div>
            {/* Bike Body */}
            <div className="h-12 w-6 rounded-full bg-red-700 border-2 border-slate-900 shadow-xl flex items-center justify-center">
              <span className="text-[8px] font-black text-white">MÔ TÔ</span>
            </div>
          </div>
          <span className="mt-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-extrabold text-red-300 border border-red-500 shadow">
            Mô Tô (Đường ưu tiên)
          </span>
        </div>

        {/* 3. XE KHÁCH (BUS) - Starts Top-Right, Drives Straight */}
        <div
          style={{
            transform:
              currentStep >= 2
                ? "translate(180px, 200px) rotate(-145deg)"
                : "translate(500px, 60px) rotate(-145deg)",
            transition: currentStep === 2 ? "transform 2.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            opacity: currentStep > 2 ? 0.35 : 1,
          }}
          className="absolute left-0 top-0 will-change-transform z-20 flex flex-col items-center"
        >
          {/* 3D Bus Body */}
          <div className="h-16 w-36 rounded-xl bg-lime-800 border-2 border-lime-950 shadow-2xl flex items-center justify-around px-2 text-[10px] font-black text-white">
            <span>🪟 🪟 🪟 XE KHÁCH</span>
          </div>
          <span className="mt-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-extrabold text-lime-300 border border-lime-500 shadow">
            Xe Khách (Đi thẳng)
          </span>
        </div>

        {/* 4. XE CON (BLUE SEDAN) - Starts Bottom-Left, Turns Left */}
        <div
          style={{
            transform:
              currentStep >= 3
                ? "translate(270px, 60px) rotate(-55deg) scale(0.9)"
                : "translate(60px, 260px) rotate(15deg)",
            transition: currentStep === 3 ? "transform 2.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            opacity: currentStep > 3 ? 0.35 : 1,
          }}
          className="absolute left-0 top-0 will-change-transform z-20 flex flex-col items-center"
        >
          {/* 3D Sedan Body */}
          <div className="h-12 w-24 rounded-2xl bg-indigo-700 border-2 border-indigo-900 shadow-2xl flex items-center justify-center text-[10px] font-black text-white">
            <span>🚗 XE CON</span>
          </div>
          <span className="mt-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-extrabold text-indigo-300 border border-indigo-500 shadow">
            Xe Con (Rẽ trái)
          </span>
        </div>
      </div>

      {/* Step Sequence Badges */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(false);
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${
              currentStep === 1
                ? "bg-amber-400 text-slate-950 ring-4 ring-amber-300/60 shadow-lg scale-105"
                : currentStep > 1
                ? "bg-emerald-700 text-white"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            Pha 1: Xe Tải (rẽ phải) + Mô Tô (đi thẳng)
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentStep(2);
              setIsPlaying(false);
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${
              currentStep === 2
                ? "bg-amber-400 text-slate-950 ring-4 ring-amber-300/60 shadow-lg scale-105"
                : currentStep > 2
                ? "bg-emerald-700 text-white"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            Pha 2: Xe Khách (đi thẳng)
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentStep(3);
              setIsPlaying(false);
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all ${
              currentStep === 3
                ? "bg-amber-400 text-slate-950 ring-4 ring-amber-300/60 shadow-lg scale-105"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            Pha 3: Xe Con (rẽ trái)
          </button>
        </div>

        {/* Context Commentary Box */}
        <div className="rounded-2xl border border-sky-800/60 bg-sky-950/60 p-4 text-xs space-y-2">
          <div className="font-black text-amber-300 text-xs sm:text-sm">
            {getPhaseExplanation(currentStep)}
          </div>
          <p className="text-slate-300 text-[11px] font-medium leading-relaxed">
            Quy tắc 5 bước giải sa hình: 1. Nhất chớm ➔ 2. Nhì ưu ➔ 3. Tam đường (Xe tải & Mô tô) ➔ 4. Tứ hướng ➔ 5. Ngũ hướng (Đi thẳng trước, rẽ trái sau).
          </p>
        </div>
      </div>
    </div>
  );
}
