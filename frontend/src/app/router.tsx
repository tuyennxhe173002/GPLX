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
import { MnemonicsPage } from "../pages/MnemonicsPage";
import { MnemonicDetailPage } from "../pages/MnemonicDetailPage";
import { RandomPracticePage } from "../pages/RandomPracticePage";
import { TheoryPage } from "../pages/TheoryPage";
import { WrongQuestionsPage } from "../pages/WrongQuestionsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <TheoryPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "theory",
        element: <TheoryPage />,
      },
      {
        path: "theory/600-cau",
        element: <ChaptersPage />,
      },
      {
        path: "theory/theo-chuong",
        element: <ChaptersPage />,
      },
      {
        path: "theory/cau-diem-liet",
        element: <CriticalPracticePage />,
      },
      {
        path: "theory/exam",
        element: <ExamSetupPage />,
      },
      {
        path: "mnemonics",
        element: <MnemonicsPage />,
      },
      {
        path: "mnemonics/:id",
        element: <MnemonicDetailPage />,
      },
      {
        path: "tip-details/:id",
        element: <MnemonicDetailPage />,
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
        path: "wrong-questions",
        element: <WrongQuestionsPage />,
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
        path: "theory/thi-theo-de",
        element: <ExamSetupPage />,
      },
      {
        path: "theory/exam/:license/:examId",
        element: <ExamSessionPage />,
      },
      {
        path: "exam",
        element: <ExamSetupPage />,
      },
      {
        path: "exam/:license/:examId",
        element: <ExamSessionPage />,
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


