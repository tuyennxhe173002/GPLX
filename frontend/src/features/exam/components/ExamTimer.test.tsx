import { screen } from "@testing-library/react";
import { ExamTimer } from "./ExamTimer";
import { renderWithProviders } from "../../../test/renderWithProviders";

describe("ExamTimer", () => {
  it("renders formatted countdown", () => {
    renderWithProviders(<ExamTimer remainingSeconds={125} profileCode="B2" />);

    expect(screen.getByText("02:05")).toBeInTheDocument();
    expect(screen.getByText(/Thi thu B2/)).toBeInTheDocument();
  });
});
