import Image from "next/image";
import Link from "next/link";
import { SITE_LOGO, SITE_NAME } from "@/constants";
import { cn } from "@/lib/utils";

/** Sized for the stacked Growra mark (buildings + wordmark + tagline). */
const SIZE_CLASS = {
  sm: "h-14 w-auto max-w-[7.5rem]",
  md: "h-[4.25rem] w-auto max-w-[9rem]",
  lg: "h-20 w-auto max-w-[11rem]",
  xl: "h-28 w-auto max-w-[15rem]",
  "2xl": "h-36 w-auto max-w-[19rem]",
  "3xl": "h-44 w-auto max-w-[23rem] sm:h-52 sm:max-w-[27rem]",
} as const;

type SiteLogoProps = {
  href?: string;
  className?: string;
  size?: keyof typeof SIZE_CLASS;
  priority?: boolean;
  onClick?: () => void;
};

export function SiteLogo({
  href = "/",
  className,
  size = "lg",
  priority = false,
  onClick,
}: SiteLogoProps) {
  const image = (
    <Image
      src={SITE_LOGO}
      alt={SITE_NAME}
      width={420}
      height={310}
      priority={priority}
      unoptimized
      sizes="(max-width: 640px) 180px, 280px"
      className={cn(
        "bg-transparent object-contain object-center",
        SIZE_CLASS[size],
        className,
      )}
    />
  );

  if (!href) return image;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex shrink-0 items-center bg-transparent"
      aria-label={SITE_NAME}
    >
      {image}
    </Link>
  );
}
