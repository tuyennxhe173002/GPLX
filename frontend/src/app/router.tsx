import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthPage } from "../pages/AuthPage";
import { BookmarksPage } from "../pages/BookmarksPage";
import { ChaptersPage } from "../pages/ChaptersPage";
import { ChapterPracticePage } from "../pages/ChapterPracticePage";
import { CriticalPracticePage } from "../pages/CriticalPracticePage";
import { ExamResultPage } from "../pages/ExamResultPage";
import { ExamSessionPage } from "../pages/ExamSessionPage";
import { ExamSetupPage } from "../pages/ExamSetupPage";
import { HomePage } from "../pages/HomePage";
import { RandomPracticePage } from "../pages/RandomPracticePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "bookmarks",
        element: <BookmarksPage />,
      },
      {
        path: "chapters",
        element: <ChaptersPage />,
      },
      {
        path: "chapters/:chapterId/practice",
        element: <ChapterPracticePage />,
      },
      {
        path: "practice/random",
        element: <RandomPracticePage />,
      },
      {
        path: "practice/critical",
        element: <CriticalPracticePage />,
      },
      {
        path: "exam",
        element: <ExamSetupPage />,
      },
      {
        path: "exam/:sessionId",
        element: <ExamSessionPage />,
      },
      {
        path: "exam/:sessionId/result",
        element: <ExamResultPage />,
      },
    ],
  },
]);
