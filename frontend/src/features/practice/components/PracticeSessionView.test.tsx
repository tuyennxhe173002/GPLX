import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PracticeSessionView } from "./PracticeSessionView";
import { renderWithProviders } from "../../../test/renderWithProviders";

vi.mock("../api/practiceApi", () => ({
  submitPracticeAnswer: vi.fn().mockResolvedValue({
    questionId: 1,
    selectedAnswerId: 11,
    correct: true,
    correctAnswerIds: [11],
    explanation: "Giai thich cho cau hoi",
    animation: {
      available: true,
      attemptId: 99,
      animationId: 100,
    },
  }),
  getPracticeAttemptAnimation: vi.fn().mockResolvedValue({
    id: 100,
    questionId: 1,
    sceneWidth: 800,
    sceneHeight: 600,
    backgroundImageUrl: null,
    durationMs: 1500,
    animationData: { steps: [] },
  }),
}));

vi.mock("../../bookmarks/api/bookmarkApi", () => ({
  getBookmarks: vi.fn().mockResolvedValue([]),
  addBookmark: vi.fn(),
  removeBookmark: vi.fn(),
}));

vi.mock("../../progress/api/progressApi", () => ({
  getProgressSummary: vi.fn().mockResolvedValue({
    totalQuestions: 600,
    attemptedQuestions: 1,
    correctAttempts: 1,
    wrongAttempts: 0,
    masteryScore: 1,
  }),
}));

describe("PracticeSessionView", () => {
  it("allows selecting an answer and shows explanation after submit", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <PracticeSessionView
        title="Luyen tap"
        description="Mo ta"
        questions={[
          {
            id: 1,
            questionNumber: 1,
            chapterId: 1,
            chapterCode: "CH1",
            content: "Noi dung cau hoi",
            imageUrl: null,
            questionType: "TEXT",
            isCritical: false,
            answers: [
              { id: 11, label: "A", content: "Dap an A", sortOrder: 1 },
              { id: 12, label: "B", content: "Dap an B", sortOrder: 2 },
            ],
          },
        ]}
      />,
    );

    expect(screen.queryByText("Loi giai")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Dap an A/i }));
    await user.click(screen.getByRole("button", { name: "Tra loi" }));

    expect(await screen.findByText("Loi giai")).toBeInTheDocument();
    expect(screen.getByText("Giai thich cho cau hoi")).toBeInTheDocument();
    expect(await screen.findByText("Du lieu animation explanation")).toBeInTheDocument();
    expect(screen.getByText(/Duration: 1500ms/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Tra loi dung/)).toBeInTheDocument();
    });
  });
});
