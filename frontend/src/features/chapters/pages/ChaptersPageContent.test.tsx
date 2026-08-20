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
  it("renders chapter list", async () => {
    renderWithProviders(<ChaptersPageContent />);

    expect(await screen.findByText("Khai niem")).toBeInTheDocument();
    expect(screen.getByText("Mo ta chuong")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Luyen theo chuong" })).toHaveAttribute("href", "/chapters/1/practice");
  });
});
