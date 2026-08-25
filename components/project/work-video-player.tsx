"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export function WorkVideoPlayer({
  title,
  videoId,
}: {
  title: string;
  videoId: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel [&_.yt-lite]:aspect-video [&_.yt-lite]:h-full [&_.yt-lite]:w-full">
      <LiteYouTubeEmbed
        id={videoId}
        poster="maxresdefault"
        title={title}
        webp
      />
    </div>
  );
}
