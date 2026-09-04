import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllExplanationVideos } from "../api/explanationVideoApi";
import { VideoEditorModal } from "../components/VideoEditorModal";
import type { ExplanationVideo } from "../types/explanationVideo";
import { useAuth } from "../../auth/hooks/useAuth";

export function VideoManagementPage() {
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<ExplanationVideo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: videos, isLoading } = useQuery({
    queryKey: ["all-explanation-videos"],
    queryFn: getAllExplanationVideos,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["all-explanation-videos"] });
    setSelectedVideo(null);
  };

  const filteredVideos = (videos || []).filter((v) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.questionNumber.toString().includes(term) ||
      (v.title && v.title.toLowerCase().includes(term)) ||
      v.sourceUrl.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Quản lý Video Sa Hình</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Danh sách tất cả các video hướng dẫn giải thế sa hình lưu qua liên kết Google Drive
          </p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo số câu hoặc tiêu đề..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-[#003466] focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          Đang tải danh sách video...
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-slate-600">Chưa có video nào hoặc không tìm thấy kết quả.</p>
          <p className="mt-1 text-xs text-slate-400">
            Bạn có thể vào trực tiếp từng câu hỏi sa hình để thêm video minh họa.
          </p>
          <Link
            to="/chapters"
            className="mt-4 inline-block rounded-xl bg-[#003466] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#00254a]"
          >
            Đến danh sách 600 câu &rarr;
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Câu hỏi</th>
                  <th className="px-6 py-4">Tiêu đề video</th>
                  <th className="px-6 py-4">File ID Drive</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVideos.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-black text-slate-900">
                      Câu {item.questionNumber}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.title || <i>(Chưa đặt tiêu đề)</i>}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {item.externalFileId}
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100"
                      >
                        Mở Drive
                      </a>
                      {can("VIDEO_UPDATE") && (
                        <button
                          type="button"
                          onClick={() => setSelectedVideo(item)}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 transition hover:bg-blue-100 border border-blue-200"
                        >
                          Sửa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedVideo && (
        <VideoEditorModal
          questionId={selectedVideo.questionId}
          questionNumber={selectedVideo.questionNumber}
          existingVideo={selectedVideo}
          isOpen={Boolean(selectedVideo)}
          onClose={() => setSelectedVideo(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
