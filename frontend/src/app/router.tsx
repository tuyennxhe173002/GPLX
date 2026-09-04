import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { ChangePasswordPage } from "../features/auth/pages/ChangePasswordPage";
import { ProfilePage } from "../features/auth/pages/ProfilePage";
import { AdminUsersPage } from "../features/account-management/pages/AdminUsersPage";
import { AdminRolePermissionsPage } from "../features/role-permission/pages/AdminRolePermissionsPage";
import { VideoManagementPage } from "../features/explanation-video/pages/VideoManagementPage";
import { BookmarksPage } from "../pages/BookmarksPage";
import { ChaptersPage } from "../pages/ChaptersPage";
import { ChapterPracticePage } from "../pages/ChapterPracticePage";
import { CriticalPracticePage } from "../pages/CriticalPracticePage";
import { ExamResultPage } from "../pages/ExamResultPage";
import { ExamSessionPage } from "../pages/ExamSessionPage";
import { ExamSetupPage } from "../pages/ExamSetupPage";
import { HistoryPage } from "../pages/HistoryPage";
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
      // Auth routes
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "auth",
        element: <LoginPage />,
      },
      // Authenticated User Features
      {
        path: "wrong-questions",
        element: <WrongQuestionsPage />,
      },
      {
        path: "bookmarks",
        element: <BookmarksPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      // Teacher / Admin Video Management
      {
        path: "videos",
        element: <VideoManagementPage />,
      },
      // Admin Only
      {
        path: "admin/users",
        element: <AdminUsersPage />,
      },
      {
        path: "admin/roles",
        element: <AdminRolePermissionsPage />,
      },
    ],
  },
]);
