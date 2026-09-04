import { useState } from "react";
import {
  createExplanationVideo,
  deleteExplanationVideo,
  previewExplanationVideo,
  updateExplanationVideo,
} from "../api/explanationVideoApi";
import type { ExplanationVideo } from "../types/explanationVideo";
import { DriveVideoPlayer } from "./DriveVideoPlayer";
import { ApiError } from "../../../shared/api/apiClient";

interface VideoEditorModalProps {
  questionId: number;
  questionNumber: number;
  existingVideo?: ExplanationVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VideoEditorModal({
  questionId,
  questionNumber,
  existingVideo,
  isOpen,
  onClose,
  onSuccess,
}: VideoEditorModalProps) {
  const [driveUrl, setDriveUrl] = useState(existingVideo?.sourceUrl || "");
  const [title, setTitle] = useState(existingVideo?.title || `Video giải thích câu ${questionNumber}`);
  const [previewEmbedUrl, setPreviewEmbedUrl] = useState<string | null>(existingVideo?.embedUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePreview = async () => {
    if (!driveUrl.trim()) {
      setErrorMessage("Vui lòng nhập link Google Drive");
      return;
    }
    setErrorMessage(null);
    setIsPreviewing(true);

    try {
      const res = await previewExplanationVideo({ driveUrl: driveUrl.trim() });
      setPreviewEmbedUrl(res.embedUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Link Google Drive không hợp lệ. Vui lòng kiểm tra lại quyền chia sẻ.");
      }
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) {
      setErrorMessage("Vui lòng nhập link Google Drive");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (existingVideo) {
        await updateExplanationVideo(questionId, {
          driveUrl: driveUrl.trim(),
          title: title.trim(),
          isActive: true,
        });
      } else {
        await createExplanationVideo(questionId, {
          driveUrl: driveUrl.trim(),
          title: title.trim(),
          isActive: true,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Không thể lưu video. Vui lòng kiểm tra lại đường dẫn.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video giải thích này?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteExplanationVideo(questionId);
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Không thể xóa video.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {existingVideo ? `Cập nhật video câu ${questionNumber}` : `Thêm video giải thích câu ${questionNumber}`}
            </h2>
            <p className="text-xs text-slate-500">
              Chỉ chấp nhận link chia sẻ từ Google Drive (ví dụ: https://drive.google.com/file/d/...)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Link Google Drive
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="url"
                required
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#003466] focus:bg-white"
              />
              <button
                type="button"
                onClick={handlePreview}
                disabled={isPreviewing || !driveUrl.trim()}
                className="shrink-0 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
              >
                {isPreviewing ? "Kiểm tra..." : "Xem thử"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Lưu ý: File Drive phải được chia sẻ ở chế độ "Bất kỳ ai có đường liên kết" (Anyone with the link) để học viên có thể xem được.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Tiêu đề video (Tùy chọn)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Video mô phỏng cách giải thế sa hình..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#003466] focus:bg-white"
            />
          </div>

          {previewEmbedUrl && (
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Xem trước video
              </label>
              <DriveVideoPlayer embedUrl={previewEmbedUrl} title={title} />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            {existingVideo ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                Xóa video
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-[#003466] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#00254a] disabled:opacity-50"
              >
                {isLoading ? "Đang lưu..." : existingVideo ? "Lưu thay đổi" : "Lưu video"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
