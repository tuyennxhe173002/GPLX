import { screen } from "@testing-library/react";
import { ChaptersPageContent } from "./ChaptersPageContent";
import { renderWithProviders } from "../../../test/renderWithProviders";

vi.mock("../api/chapterApi", () => ({
  getChapters: vi.fn().mockResolvedValue([
    {
      id: 1,
      code: "CH1",
      name: "Khai niem",
      description: "Mo ta chuong",
      sortOrder: 1,
    },
  ]),
}));

vi.mock("../../progress/api/progressApi", () => ({
  getChapterProgress: vi.fn().mockResolvedValue([]),
}));

describe("ChaptersPageContent", () => {
  it("renders chapter list and practice interface", async () => {
    renderWithProviders(<ChaptersPageContent />);

    const matching = await screen.findAllByText(/Khai niem/i);
    expect(matching.length).toBeGreaterThan(0);
    expect(screen.getByText("Ôn tập theo chương")).toBeInTheDocument();
  });
});
