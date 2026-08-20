import { screen } from "@testing-library/react";
import { ExamResultPageContent } from "./ExamResultPageContent";
import { renderWithProviders } from "../../../test/renderWithProviders";

vi.mock("../api/examApi", () => ({
  getExamResult: vi.fn().mockResolvedValue({
    examId: 1,
    profileCode: "B2",
    state: "SUBMITTED",
    score: 46,
    passed: false,
    criticalWrongCount: 1,
    questions: [
      {
        questionId: 10,
        questionNumber: 3,
        selectedAnswerId: 201,
        correctAnswerIds: [202],
        correct: false,
        explanation: "Loi giai cau sai",
      },
    ],
  }),
}));

describe("ExamResultPageContent", () => {
  it("renders exam result review", async () => {
    renderWithProviders(<ExamResultPageContent />, {
      route: "/exam/1/result",
      path: "/exam/:sessionId/result",
    });

    expect(await screen.findByText("Ket qua thi B2")).toBeInTheDocument();
    expect(screen.getByText("Chua dat")).toBeInTheDocument();
    expect(screen.getByText("Loi giai cau sai")).toBeInTheDocument();
  });
});
