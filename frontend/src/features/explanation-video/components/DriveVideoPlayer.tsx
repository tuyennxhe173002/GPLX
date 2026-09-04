interface DriveVideoPlayerProps {
  embedUrl: string;
  title?: string | null;
}

export function DriveVideoPlayer({ embedUrl, title }: DriveVideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/20 bg-slate-950 shadow-md">
      {title && (
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/90 px-4 py-2 text-xs font-bold text-slate-200">
          <svg className="h-4 w-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM4 6v12h16V6H4zm6 2l6 4-6 4V8z" />
          </svg>
          <span>{title}</span>
        </div>
      )}
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title || "Video giải thích sa hình"}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
