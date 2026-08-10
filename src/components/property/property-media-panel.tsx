"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Maximize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PropertyMediaPanelProps {
  images: string[];
  title: string;
  videoUrl?: string;
}

export function PropertyMediaPanel({ images, title, videoUrl }: PropertyMediaPanelProps) {
  const list = useMemo(() => (images.length ? images : []), [images]);
  const hasVideo = Boolean(videoUrl);

  const [tab, setTab] = useState<"videos" | "property" | "society">(
    hasVideo ? "videos" : "property",
  );
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const societyList = useMemo(() => {
    if (list.length === 0) return [];
    const rotated = [...list.slice(1), list[0]!];
    while (rotated.length < 12) rotated.push(...list);
    return rotated.slice(0, 12);
  }, [list]);

  const gallery = tab === "society" ? societyList : list;
  const showVideo = tab === "videos" && hasVideo;

  useEffect(() => {
    setActive(0);
    setPlaying(false);
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, [tab, videoUrl]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActive((i) => (i <= 0 ? gallery.length - 1 : i - 1));
      } else if (e.key === "ArrowRight") {
        setActive((i) => (i >= gallery.length - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, gallery.length]);

  const prev = useCallback(() => {
    if (gallery.length < 2) return;
    setActive((i) => (i <= 0 ? gallery.length - 1 : i - 1));
  }, [gallery.length]);

  const next = useCallback(() => {
    if (gallery.length < 2) return;
    setActive((i) => (i >= gallery.length - 1 ? 0 : i + 1));
  }, [gallery.length]);

  const togglePlay = useCallback(async () => {
    const el = videoRef.current;
    if (!el || !showVideo) return;
    try {
      if (el.paused) {
        await el.play();
        setPlaying(true);
      } else {
        el.pause();
        setPlaying(false);
      }
    } catch {
      setPlaying(false);
    }
  }, [showVideo]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const openViewer = useCallback(async () => {
    if (showVideo) {
      const stage = stageRef.current;
      if (!stage) return;
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await stage.requestFullscreen();
      } catch {
        // ignore
      }
      return;
    }
    setLightboxOpen(true);
  }, [showVideo]);

  const tabs = [
    { id: "videos" as const, label: `Videos (${hasVideo ? 1 : 0})`, disabled: !hasVideo },
    { id: "property" as const, label: `Property (${list.length})`, disabled: list.length === 0 },
    {
      id: "society" as const,
      label: `Society (${societyList.length || Math.max(list.length, 0)})`,
      disabled: societyList.length === 0,
    },
  ];

  return (
    <>
      <div
        ref={stageRef}
        className="relative aspect-[4/3] overflow-hidden rounded-xl bg-charcoal sm:aspect-[16/11]"
      >
        {showVideo ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={list[0]}
            playsInline
            muted={muted}
            loop
            className="absolute inset-0 h-full w-full object-cover"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onClick={togglePlay}
          />
        ) : gallery[active] ? (
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open photo gallery"
          >
            <Image
              src={gallery[active]!}
              alt={`${title} — ${tab} ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
            {tab === "videos" ? "No video available" : "No photos available"}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-charcoal/20" />

        <div className="absolute top-3 left-3 z-10 flex gap-1 rounded-lg bg-charcoal/55 p-1 backdrop-blur-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={t.disabled}
              onClick={() => {
                if (t.disabled) return;
                setTab(t.id);
              }}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium text-white/80 transition",
                tab === t.id &&
                  "bg-white/20 text-white underline decoration-gold decoration-2 underline-offset-4",
                t.disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {showVideo ? (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow transition hover:bg-white"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>
        ) : gallery.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow transition hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow transition hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <div className="absolute right-3 bottom-3 z-10 flex items-center gap-2">
          {!showVideo && gallery.length > 0 ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="rounded-md bg-charcoal/70 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-charcoal/90"
            >
              View all ({gallery.length})
            </button>
          ) : null}
          {showVideo ? (
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-charcoal/60 text-white transition hover:bg-charcoal/80"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          ) : null}
          <button
            type="button"
            onClick={openViewer}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-charcoal/60 text-white transition hover:bg-charcoal/80"
            aria-label={showVideo ? "Fullscreen" : "Open gallery"}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-rose-500/90 px-2.5 py-1.5 text-[11px] font-medium text-white shadow">
          <Flame className="h-3.5 w-3.5" />
          8 people already contacted yesterday
        </div>

        {!showVideo && gallery.length > 1 ? (
          <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            <span className="rounded bg-charcoal/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {active + 1}/{gallery.length}
            </span>
            <div className="flex gap-1">
              {gallery.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-1.5 rounded-full transition",
                    i === active ? "w-3 bg-white" : "w-1.5 bg-white/40",
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-h-[95vh] max-w-5xl border-none bg-charcoal p-3 text-white sm:rounded-2xl">
          <DialogTitle className="sr-only">{title} photo gallery</DialogTitle>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-white/80">
              {tab === "society" ? "Society" : "Property"} photos · {active + 1} of {gallery.length}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            {gallery[active] ? (
              <Image
                src={gallery[active]!}
                alt={`${title} — photo ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            ) : null}
            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {gallery.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2",
                  i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100",
                )}
                aria-label={`Show photo ${i + 1}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
