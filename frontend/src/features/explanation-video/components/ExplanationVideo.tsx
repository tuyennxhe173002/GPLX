import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getExplanationVideo } from "../api/explanationVideoApi";
import { DriveVideoPlayer } from "./DriveVideoPlayer";
import { VideoEditorModal } from "./VideoEditorModal";
import { useAuth } from "../../auth/hooks/useAuth";

interface ExplanationVideoProps {
  questionId: number;
  questionNumber: number;
}

export function ExplanationVideo({ questionId, questionNumber }: ExplanationVideoProps) {
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManageVideo = can("VIDEO_CREATE") || can("VIDEO_UPDATE") || can("VIDEO_DELETE");

  const { data: video, isLoading } = useQuery({
    queryKey: ["explanation-video", questionId],
    queryFn: () => getExplanationVideo(questionId),
    staleTime: 5 * 60 * 1000,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["explanation-video", questionId] });
    queryClient.invalidateQueries({ queryKey: ["all-explanation-videos"] });
  };

  if (isLoading) {
    return null;
  }

  if (!video && !canManageVideo) {
    return null;
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Video minh họa sa hình
          </h3>
        </div>

        {canManageVideo && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#003466] shadow-sm transition hover:bg-slate-50"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{video ? "Quản lý video" : "+ Thêm video Google Drive"}</span>
          </button>
        )}
      </div>

      {video && video.embedUrl ? (
        <DriveVideoPlayer embedUrl={video.embedUrl} title={video.title} />
      ) : canManageVideo ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Chưa có video giải thích cho câu hỏi này.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#003466] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#00254a]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm link Google Drive</span>
          </button>
        </div>
      ) : null}

      {isModalOpen && (
        <VideoEditorModal
          questionId={questionId}
          questionNumber={questionNumber}
          existingVideo={video}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
