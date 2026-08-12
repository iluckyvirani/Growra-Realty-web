"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ExternalLink, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { PropertyShort } from "@/services/shorts-service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ShortCard({
  short,
  compact = false,
}: {
  short: PropertyShort;
  compact?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-charcoal shadow-md",
        compact ? "aspect-[9/16] w-[160px] shrink-0 sm:w-[180px]" : "aspect-[9/16] w-full",
      )}
    >
      <video
        ref={videoRef}
        src={short.videoUrl}
        poster={short.thumbnailUrl || undefined}
        className="h-full w-full object-cover"
        playsInline
        loop
        muted={muted}
        preload="metadata"
        onClick={togglePlay}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <button
        type="button"
        onClick={togglePlay}
        className="absolute top-1/2 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
      </button>

      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 space-y-2 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-white">{short.title}</p>
        {short.description ? (
          <p className="line-clamp-2 text-[11px] text-white/75">{short.description}</p>
        ) : null}
        {short.propertySlug ? (
          <Button
            asChild
            size="sm"
            className="pointer-events-auto h-8 w-full bg-gold text-xs font-semibold text-white hover:bg-gold-rich"
          >
            <Link href={`/property/${short.propertySlug}`} target="_blank" rel="noopener noreferrer">
              View property
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
