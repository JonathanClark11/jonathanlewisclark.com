import type { Metadata } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jonathan Lewis Clark — Senior Engineering Leader",
  description:
    "Senior engineering leader with 12+ years at Amazon. Building and scaling distributed systems, high-performing engineering organizations, and consumer AI products.",
  openGraph: {
    title: "Jonathan Lewis Clark — Senior Engineering Leader",
    description:
      "Senior engineering leader with 12+ years at Amazon. Building and scaling distributed systems, high-performing engineering organizations, and consumer AI products.",
    type: "website",
    url: "https://jonathanlewisclark.com",
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
      className={`${cormorant.variable} ${dmSans.variable} antialiased`}
    >
      <body className="grain topo-pattern">{children}</body>
    </html>
  );
}
