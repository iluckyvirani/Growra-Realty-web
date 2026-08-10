import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Growra Realty properties.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
