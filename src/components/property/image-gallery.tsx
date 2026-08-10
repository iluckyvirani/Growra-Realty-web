"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const list = images.length ? images : [];

  if (!list.length) return null;

  const prev = () => setActive((i) => (i === 0 ? list.length - 1 : i - 1));
  const next = () => setActive((i) => (i === list.length - 1 ? 0 : i + 1));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[21/9]">
        <Image
          src={list[active]}
          alt={`${title} — image ${active + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />

        {list.length > 1 ? (
          <>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute top-1/2 left-3 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90"
              onClick={prev}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute top-1/2 right-3 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90"
              onClick={next}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        ) : null}

        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute right-3 bottom-3 gap-1.5 rounded-xl bg-white/95"
          onClick={() => setOpen(true)}
        >
          <Expand className="h-4 w-4" />
          View all ({list.length})
        </Button>

        <span className="absolute bottom-3 left-3 rounded-xl bg-charcoal/70 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
          {active + 1} / {list.length}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {list.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-20 md:w-28",
              i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100",
            )}
            aria-label={`Show image ${i + 1}`}
          >
            <Image src={src} alt="" fill sizes="112px" className="object-cover" />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-none bg-charcoal p-2 sm:rounded-2xl">
          <DialogTitle className="sr-only">{title} gallery</DialogTitle>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={list[active]}
              alt={`${title} — fullscreen`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
