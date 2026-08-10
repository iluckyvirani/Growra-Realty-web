import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME, SITE_TAGLINE } from "@/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "luxury real estate",
    "buy property",
    "rent apartment",
    "Growra Realty",
    "premium homes India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: SITE_LOGO,
    apple: SITE_LOGO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col pb-[calc(3.75rem+env(safe-area-inset-bottom))] font-sans md:pb-0"
        suppressHydrationWarning
      >
        <AppProviders>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
