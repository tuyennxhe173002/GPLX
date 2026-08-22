export type VehicleType =
  | "fire_truck"
  | "military"
  | "police"
  | "ambulance"
  | "car"
  | "truck"
  | "bus"
  | "moto"
  | "your_car";

export type VehicleDirection = "straight" | "turn_right" | "turn_left" | "u_turn";

export type VehicleSimulationState = {
  id: string;
  name: string;
  type: VehicleType;
  startPosition: "bottom" | "top" | "left" | "right";
  direction: VehicleDirection;
  stepOrder: number; // 1, 2, 3...
  ruleReason: string; // e.g. "Xe ưu tiên", "Đường ưu tiên", "Bên phải không vướng", "Rẽ phải đi trước"
  color: string;
};

export type SaHinhSimulationConfig = {
  junctionType: "crossroad" | "t_junction" | "roundabout" | "priority_road";
  title: string;
  ruleSummary: string;
  vehicles: VehicleSimulationState[];
};

// Heuristic scenario generator for Sa hình questions (numbers 486 to 600)
export function getSaHinhSimulation(questionNumber: number, content: string, explanation?: string | null): SaHinhSimulationConfig | null {
  // Only Sa hình questions (around 486 - 600 or with traffic situation keywords)
  const isSaHinh =
    questionNumber >= 486 ||
    content.includes("thứ tự các xe") ||
    content.includes("xe nào được quyền đi trước") ||
    content.includes("xe nào chấp hành đúng") ||
    content.includes("xe nào vi phạm");

  if (!isSaHinh) return null;

  const text = (content + " " + (explanation || "")).toLowerCase();

  // Pattern 1: Xe ưu tiên (Cứu hỏa / Quân sự / Công an / Cứu thương)
  if (text.includes("quân sự") || text.includes("công an") || text.includes("cứu hỏa") || text.includes("cứu thương")) {
    const hasPolice = text.includes("công an");
    const hasMilitary = text.includes("quân sự");
    const hasFire = text.includes("cứu hỏa");
    const hasAmbulance = text.includes("cứu thương");

    const vehicles: VehicleSimulationState[] = [];
    let order = 1;

    if (hasFire) {
      vehicles.push({
        id: "v1",
        name: "Xe Cứu hỏa",
        type: "fire_truck",
        startPosition: "bottom",
        direction: "straight",
        stepOrder: order++,
        ruleReason: "Xe ưu tiên số 1 (Hỏa)",
        color: "#dc2626",
      });
    }

    if (hasMilitary) {
      vehicles.push({
        id: "v2",
        name: "Xe Quân sự",
        type: "military",
        startPosition: "left",
        direction: "straight",
        stepOrder: order++,
        ruleReason: "Xe ưu tiên số 2 (Sự)",
        color: "#15803d",
      });
    }

    if (hasPolice) {
      vehicles.push({
        id: "v3",
        name: "Xe Công an",
        type: "police",
        startPosition: "top",
        direction: "straight",
        stepOrder: order++,
        ruleReason: "Xe ưu tiên số 3 (An)",
        color: "#1d4ed8",
      });
    }

    if (hasAmbulance) {
      vehicles.push({
        id: "v4",
        name: "Xe Cứu thương",
        type: "ambulance",
        startPosition: "right",
        direction: "straight",
        stepOrder: order++,
        ruleReason: "Xe ưu tiên số 4 (Thương)",
        color: "#f8fafc",
      });
    }

    // Normal civilian vehicles
    vehicles.push({
      id: "v_car",
      name: "Xe con",
      type: "car",
      startPosition: "right",
      direction: "straight",
      stepOrder: order++,
      ruleReason: "Xe dân sự đi sau xe ưu tiên",
      color: "#f59e0b",
    });

    vehicles.push({
      id: "v_moto",
      name: "Xe mô tô",
      type: "moto",
      startPosition: "bottom",
      direction: "turn_right",
      stepOrder: order,
      ruleReason: "Đi sau cùng theo hướng đi",
      color: "#0284c7",
    });

    return {
      junctionType: "crossroad",
      title: "Mô phỏng: Thứ tự xe ưu tiên (Hỏa ➔ Sự ➔ An ➔ Thương)",
      ruleSummary: "Quy tắc 2 (Nhì ưu): Xe chữa cháy ➔ Xe quân sự, công an ➔ Xe cứu thương ➔ Xe dân sự.",
      vehicles,
    };
  }

  // Pattern 2: Vòng xuyến
  if (text.includes("vòng xuyến") || text.includes("bùng binh")) {
    return {
      junctionType: "roundabout",
      title: "Mô phỏng: Nhường đường tại nơi có đảo an toàn (Vòng xuyến)",
      ruleSummary: "Có biển vòng xuyến: Nhường đường cho xe bên TRÁI. Không có biển: Nhường bên PHẢI.",
      vehicles: [
        {
          id: "v1",
          name: "Xe con (Trong vòng xuyến)",
          type: "car",
          startPosition: "left",
          direction: "turn_left",
          stepOrder: 1,
          ruleReason: "Đang đi trong vòng xuyến (ưu tiên)",
          color: "#3b82f6",
        },
        {
          id: "v2",
          name: "Xe của bạn",
          type: "your_car",
          startPosition: "bottom",
          direction: "straight",
          stepOrder: 2,
          ruleReason: "Phải giảm tốc độ nhường đường cho xe bên trái",
          color: "#10b981",
        },
      ],
    };
  }

  // Pattern 3: Thứ tự theo 5 quy tắc chuẩn (Xe tải, Xe khách, Xe con, Mô tô)
  return {
    junctionType: "crossroad",
    title: "Mô phỏng: Thứ tự đi theo Quyền bên phải & Hướng đi",
    ruleSummary: "Quy tắc 4 & 5: Bên phải không vướng đi trước ➔ Hướng đi: Rẽ phải ➔ Đi thẳng ➔ Rẽ trái.",
    vehicles: [
      {
        id: "v1",
        name: "Xe tải",
        type: "truck",
        startPosition: "right",
        direction: "turn_right",
        stepOrder: 1,
        ruleReason: "Bên phải thông thoáng & Rẽ phải được đi trước",
        color: "#f59e0b",
      },
      {
        id: "v2",
        name: "Xe khách",
        type: "bus",
        startPosition: "top",
        direction: "straight",
        stepOrder: 2,
        ruleReason: "Đi thẳng (khi bên phải đã thông thoáng)",
        color: "#0284c7",
      },
      {
        id: "v3",
        name: "Xe con",
        type: "car",
        startPosition: "bottom",
        direction: "turn_left",
        stepOrder: 3,
        ruleReason: "Rẽ trái phải nhường xe đi thẳng",
        color: "#dc2626",
      },
      {
        id: "v4",
        name: "Xe mô tô",
        type: "moto",
        startPosition: "left",
        direction: "turn_left",
        stepOrder: 3,
        ruleReason: "Rẽ trái đi sau cùng",
        color: "#16a34a",
      },
    ],
  };
}
