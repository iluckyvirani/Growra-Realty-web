"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideMarketingChrome =
    pathname.startsWith("/portal") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/postproperty");

  useEffect(() => {
    document.body.classList.toggle("portal-mode", hideMarketingChrome);
    return () => document.body.classList.remove("portal-mode");
  }, [hideMarketingChrome]);

  if (hideMarketingChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
