import { SITE_NAME, SITE_TAGLINE } from "@/constants";
import { SiteLogo } from "@/components/common/site-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-10 md:py-14">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 45% at 50% 0%, rgba(200,155,60,0.12), transparent 60%),
            radial-gradient(ellipse 50% 35% at 100% 100%, rgba(245,230,196,0.35), transparent)
          `,
        }}
      />
      <div className="relative w-full max-w-[26rem]">
        <div className="mb-7 flex flex-col items-center text-center">
          <SiteLogo size="2xl" priority />
          <p className="mt-2.5 text-[13px] tracking-wide text-muted">{SITE_TAGLINE}</p>
        </div>

        <div className="rounded-lg border border-border/80 bg-white p-6 shadow-[0_8px_30px_rgba(27,27,27,0.08)] md:p-7">
          {children}
        </div>

        <p className="mt-5 text-center text-[11px] text-muted">
          © {new Date().getFullYear()} {SITE_NAME}. Secure access for discerning clients.
        </p>
      </div>
    </div>
  );
}
