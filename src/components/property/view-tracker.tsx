"use client";

import { useEffect } from "react";
import { useRecentStore } from "@/store";

interface ViewTrackerProps {
  propertyId: string;
}

export function ViewTracker({ propertyId }: ViewTrackerProps) {
  const addViewed = useRecentStore((s) => s.addViewed);

  useEffect(() => {
    if (!propertyId) return;
    addViewed(propertyId);
  }, [propertyId, addViewed]);

  return null;
}
