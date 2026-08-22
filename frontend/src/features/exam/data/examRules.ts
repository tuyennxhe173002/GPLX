import examSetsData from "./examSetsData.json";

export type LicenseClassConfig = {
  code: string;
  name: string;
  shortLabel: string;
  durationMinutes: number;
  totalQuestions: number;
  minPassingScore: number;
  description: string;
  testCount: number;
};

export const LICENSE_CONFIGS: Record<string, LicenseClassConfig> = {
  B: {
    code: "B",
    name: "Hạng B",
    shortLabel: "B",
    durationMinutes: 20,
    totalQuestions: 30,
    minPassingScore: 27,
    description: "Ô tô chở người đến 9 chỗ, xe tải dưới 3.500kg",
    testCount: (examSetsData as any).B?.length || 22,
  },
  C1: {
    code: "C1",
    name: "Hạng C1",
    shortLabel: "C1",
    durationMinutes: 22,
    totalQuestions: 35,
    minPassingScore: 32,
    description: "Ô tô tải từ 3.500kg đến 7.500kg",
    testCount: (examSetsData as any).C1?.length || 32,
  },
  C: {
    code: "C",
    name: "Hạng C",
    shortLabel: "C",
    durationMinutes: 24,
    totalQuestions: 40,
    minPassingScore: 36,
    description: "Ô tô tải trên 7.500kg",
    testCount: (examSetsData as any).C?.length || 29,
  },
  D1: {
    code: "D1",
    name: "Hạng D1",
    shortLabel: "D1",
    durationMinutes: 26,
    totalQuestions: 45,
    minPassingScore: 41,
    description: "Ô tô chở người từ 10 đến 16 chỗ",
    testCount: (examSetsData as any).D1?.length || 29,
  },
  D2: {
    code: "D2",
    name: "Hạng D2",
    shortLabel: "D2",
    durationMinutes: 26,
    totalQuestions: 45,
    minPassingScore: 41,
    description: "Ô tô chở người từ 17 đến 30 chỗ",
    testCount: (examSetsData as any).D2?.length || 29,
  },
  D: {
    code: "D",
    name: "Hạng D",
    shortLabel: "D",
    durationMinutes: 26,
    totalQuestions: 45,
    minPassingScore: 41,
    description: "Ô tô chở người trên 30 chỗ",
    testCount: (examSetsData as any).D?.length || 29,
  },
  CE: {
    code: "CE",
    name: "Hạng CE",
    shortLabel: "CE",
    durationMinutes: 26,
    totalQuestions: 45,
    minPassingScore: 41,
    description: "Ô tô đầu kéo kéo rơ moóc",
    testCount: (examSetsData as any).CE?.length || 29,
  },
  DE: {
    code: "DE",
    name: "Hạng DE",
    shortLabel: "DE",
    durationMinutes: 26,
    totalQuestions: 45,
    minPassingScore: 41,
    description: "Xe khách nối toa",
    testCount: (examSetsData as any).DE?.length || 29,
  },
  A1: {
    code: "A1",
    name: "Hạng A1",
    shortLabel: "A1",
    durationMinutes: 19,
    totalQuestions: 25,
    minPassingScore: 21,
    description: "Mô tô 2 bánh dung tích xi-lanh đến 125 cm³",
    testCount: (examSetsData as any).A1?.length || 22,
  },
  A: {
    code: "A",
    name: "Hạng A",
    shortLabel: "A",
    durationMinutes: 19,
    totalQuestions: 25,
    minPassingScore: 23,
    description: "Mô tô 2 bánh dung tích xi-lanh trên 125 cm³",
    testCount: (examSetsData as any).A?.length || 22,
  },
};

export const ALL_LICENSE_LIST = Object.values(LICENSE_CONFIGS);

export function getExamQuestionNumbers(license: string, examId: number): number[] {
  const normLicense = license.toUpperCase();
  const sets = (examSetsData as any)[normLicense] || (examSetsData as any).B || [];
  const target = sets.find((s: any) => s.id === examId) || sets[0];
  return target?.question || [];
}
