import type { Metadata, Viewport } from "next";
import { contactEmail, socialLinks } from "@/lib/contact";
import { defaultSocialImage, siteDescription, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "JRC Techworks | Websites, Software, POS & Automation",
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  verification: { google: "oDnGoRP8wlV08lpXtKHJjozyPSXbnnReOTN_o0EF0Ow" },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JRC Techworks — Software that works for you",
    description: siteDescription,
    siteName,
    url: "/",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: defaultSocialImage,
        width: 1200,
        height: 630,
        alt: "JRC Techworks — Software that works for you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JRC Techworks — Software that works for you",
    description: siteDescription,
    images: [defaultSocialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070c17",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      email: contactEmail,
      sameAs: socialLinks.map((link) => link.href),
    },
    {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      description: siteDescription,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
