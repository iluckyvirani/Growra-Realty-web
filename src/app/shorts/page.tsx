import type { Metadata } from "next";
import { SITE_NAME } from "@/constants";
import { ShortCard } from "@/components/shorts/short-card";
import { getPropertyShorts } from "@/services/shorts-service";

export const metadata: Metadata = {
  title: `Property Shorts | ${SITE_NAME}`,
  description: "Watch short property videos and open full listing details in one tap.",
};

export const dynamic = "force-dynamic";

export default async function ShortsPage() {
  const shorts = await getPropertyShorts(40);

  return (
    <div className="section-padding min-h-[70vh]">
      <div className="container-luxury">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Watch & explore
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-charcoal md:text-4xl">
            Property Shorts
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            Vertical property tours. Open any linked listing to see full details, photos, and
            contact Growra Realty.
          </p>
        </div>

        {shorts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <p className="text-muted">No shorts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {shorts.map((short) => (
              <ShortCard key={short.id} short={short} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
