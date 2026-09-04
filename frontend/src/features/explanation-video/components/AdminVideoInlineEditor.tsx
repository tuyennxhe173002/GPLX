import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExplanationVideo,
  createExplanationVideo,
  updateExplanationVideo,
  deleteExplanationVideo,
  previewExplanationVideo,
} from "../api/explanationVideoApi";
import { DriveVideoPlayer } from "./DriveVideoPlayer";
import { ApiError } from "../../../shared/api/apiClient";
import { useAuth } from "../../auth/hooks/useAuth";

interface AdminVideoInlineEditorProps {
  questionId: number;
  questionNumber: number;
  chapterTitle?: string;
}

export function AdminVideoInlineEditor({
  questionId,
  questionNumber,
  chapterTitle,
}: AdminVideoInlineEditorProps) {
  const queryClient = useQueryClient();
  const { role, can } = useAuth();

  const isAdminOrCanManage = role === "ADMIN" || can("VIDEO_CREATE") || can("VIDEO_UPDATE");

  // Fetch current video for this question
  const { data: existingVideo, isLoading } = useQuery({
    queryKey: ["explanation-video", questionId],
    queryFn: () => getExplanationVideo(questionId),
    enabled: Boolean(questionId),
    staleTime: 5 * 60 * 1000,
  });

  const [driveUrl, setDriveUrl] = useState("");
  const [title, setTitle] = useState("");
  const [previewEmbedUrl, setPreviewEmbedUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state when question or existingVideo changes
  useEffect(() => {
    if (existingVideo) {
      setDriveUrl(existingVideo.sourceUrl || "");
      setTitle(existingVideo.title || `Video mô phỏng sa hình câu ${questionNumber}`);
      setPreviewEmbedUrl(existingVideo.embedUrl || null);
      setIsEditing(false);
    } else {
      setDriveUrl("");
      setTitle(`Video mô phỏng sa hình câu ${questionNumber}`);
      setPreviewEmbedUrl(null);
      setIsEditing(true);
    }
    setStatusMessage(null);
  }, [questionId, existingVideo, questionNumber]);

  // Handle previewing link
  const handlePreview = async () => {
    if (!driveUrl.trim()) {
      setStatusMessage({ type: "error", text: "Vui lòng dán link Google Drive trước khi xem thử" });
      return;
    }
    setStatusMessage(null);
    setIsPreviewing(true);

    try {
      const res = await previewExplanationVideo({ driveUrl: driveUrl.trim() });
      setPreviewEmbedUrl(res.embedUrl);
      setStatusMessage({ type: "success", text: "Link Google Drive hợp lệ! Đang hiển thị bản xem trước bên dưới." });
    } catch (err) {
      if (err instanceof ApiError) {
        setStatusMessage({ type: "error", text: err.message });
      } else {
        setStatusMessage({
          type: "error",
          text: "Link Google Drive không đúng định dạng. Ví dụ hợp lệ: https://drive.google.com/file/d/1A2B3C.../view",
        });
      }
    } finally {
      setIsPreviewing(false);
    }
  };

  // Save / Update mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const trimmedUrl = driveUrl.trim();
      const trimmedTitle = title.trim() || `Video mô phỏng sa hình câu ${questionNumber}`;

      if (existingVideo) {
        return updateExplanationVideo(questionId, {
          driveUrl: trimmedUrl,
          title: trimmedTitle,
          isActive: true,
        });
      } else {
        return createExplanationVideo(questionId, {
          driveUrl: trimmedUrl,
          title: trimmedTitle,
          isActive: true,
        });
      }
    },
    onSuccess: (savedVideo) => {
      queryClient.setQueryData(["explanation-video", questionId], savedVideo);
      queryClient.invalidateQueries({ queryKey: ["explanation-video", questionId] });
      queryClient.invalidateQueries({ queryKey: ["all-explanation-videos"] });
      setStatusMessage({ type: "success", text: "✅ Đã lưu video Google Drive thành công!" });
      setIsEditing(false);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setStatusMessage({ type: "error", text: err.message });
      } else {
        setStatusMessage({
          type: "error",
          text: "Không thể lưu video. Vui lòng kiểm tra lại đường dẫn Google Drive.",
        });
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteExplanationVideo(questionId),
    onSuccess: () => {
      queryClient.setQueryData(["explanation-video", questionId], null);
      queryClient.invalidateQueries({ queryKey: ["explanation-video", questionId] });
      queryClient.invalidateQueries({ queryKey: ["all-explanation-videos"] });
      setDriveUrl("");
      setTitle(`Video mô phỏng sa hình câu ${questionNumber}`);
      setPreviewEmbedUrl(null);
      setIsEditing(true);
      setStatusMessage({ type: "success", text: "🗑️ Đã xóa video của câu hỏi này." });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setStatusMessage({ type: "error", text: err.message });
      } else {
        setStatusMessage({ type: "error", text: "Không thể xóa video." });
      }
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa video Google Drive của câu ${questionNumber}?`)) {
      deleteMutation.mutate();
    }
  };

  if (!isAdminOrCanManage) {
    return null;
  }

  return (
    <div className="rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-rose-950">
                Quản trị viên: Gán Video Sa Hình
              </h3>
              <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-[10px] font-black text-rose-800">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500">
              {chapterTitle || "Chương 7: Sa hình"} • Câu {questionNumber} (Mã #{questionId})
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div>
          {isLoading ? (
            <span className="text-xs text-slate-400 font-semibold">Đang kiểm tra...</span>
          ) : existingVideo ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Đã có video Drive
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
              Chưa có video
            </span>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div
          className={`rounded-2xl p-3 text-xs font-semibold flex items-center justify-between gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Existing Video View (when not in edit mode) */}
      {existingVideo && !isEditing ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Link Google Drive hiện tại:</span>
              <a
                href={existingVideo.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline font-semibold max-w-[200px] truncate"
                title={existingVideo.sourceUrl}
              >
                {existingVideo.sourceUrl}
              </a>
            </div>
            {existingVideo.title && (
              <p className="text-xs text-slate-600 font-medium">
                Tiêu đề: <span className="font-bold text-slate-800">{existingVideo.title}</span>
              </p>
            )}
          </div>

          {/* Video Preview Box */}
          {existingVideo.embedUrl && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Bản xem trước video Drive:
              </p>
              <DriveVideoPlayer embedUrl={existingVideo.embedUrl} title={existingVideo.title} />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa video"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#003466] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#00254a] transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Chỉnh sửa / Đổi link
            </button>
          </div>
        </div>
      ) : (
        /* Input & Save Form (Add or Edit mode) */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!driveUrl.trim()) {
              setStatusMessage({ type: "error", text: "Vui lòng nhập link Google Drive" });
              return;
            }
            saveMutation.mutate();
          }}
          className="space-y-3"
        >
          {/* Drive link input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Dán link video Google Drive:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
              <button
                type="button"
                onClick={handlePreview}
                disabled={isPreviewing || !driveUrl.trim()}
                className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition disabled:opacity-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {isPreviewing ? "Kiểm tra..." : "Xem thử"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              💡 Lưu ý: File Google Drive cần được chia sẻ ở chế độ <b>"Bất kỳ ai có đường liên kết"</b> (Anyone with the link).
            </p>
          </div>

          {/* Title input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Tiêu đề video (Tùy chọn):
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`VD: Video mô phỏng sa hình câu ${questionNumber}`}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Preview Player if available */}
          {previewEmbedUrl && (
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Bản xem trước video Drive:
              </p>
              <DriveVideoPlayer embedUrl={previewEmbedUrl} title={title} />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {existingVideo && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setDriveUrl(existingVideo.sourceUrl || "");
                  setTitle(existingVideo.title || "");
                  setPreviewEmbedUrl(existingVideo.embedUrl || null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              disabled={saveMutation.isPending || !driveUrl.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {saveMutation.isPending
                ? "Đang lưu..."
                : existingVideo
                ? "Cập nhật video Drive"
                : "Lưu video Google Drive"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
