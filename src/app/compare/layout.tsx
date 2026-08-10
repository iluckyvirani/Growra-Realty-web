import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Properties",
  description: "Compare up to 4 properties side by side on Growra Realty.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
