import type { Metadata } from "next";
import CaseStudyPage from "@/components/case-study-page";
import { projects } from "@/lib/projects";
import { siteName } from "@/lib/seo";

const description =
  "See how SukiSuite brings appointment requests, client records, and follow-ups into one easy-to-use workspace for service businesses.";
const image = "/projects/sukisuite.png";

export const metadata: Metadata = {
  title: "SukiSuite Case Study | JRC Techworks",
  description,
  alternates: { canonical: "/work/sukisuite" },
  openGraph: {
    title: "SukiSuite — Booking & Client Management | JRC Techworks",
    description,
    url: "/work/sukisuite",
    siteName,
    type: "website",
    images: [{ url: image, alt: "SukiSuite booking and client-management interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SukiSuite — Booking & Client Management",
    description,
    images: [image],
  },
};

export default function SukiSuiteCaseStudy() {
  return <CaseStudyPage project={projects[0]} nextProject={projects[1]} />;
}
