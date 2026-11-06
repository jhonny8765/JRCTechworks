import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JRC Techworks | Software that works for you",
  description:
    "JRC Techworks creates modern websites, custom business software, POS systems, inventory tools, and thoughtful automations.",
  applicationName: "JRC Techworks",
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JRC Techworks — Build what moves you forward",
    description: "Websites, software, and smarter business workflows. Explore the work of JRC Techworks.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070c17",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
