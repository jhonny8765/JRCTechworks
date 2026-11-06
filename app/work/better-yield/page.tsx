import type { Metadata } from "next";
import CaseStudyPage from "@/components/case-study-page";
import { projects } from "@/lib/projects";
import { siteName } from "@/lib/seo";

const description =
  "Explore the Better Yield POS interface for agricultural retail, with cash checkout, stock-record, branch, and practice-checkout workflows.";
const image = "/projects/better-yield.png";

export const metadata: Metadata = {
  title: "Better Yield POS Case Study | JRC Techworks",
  description,
  alternates: { canonical: "/work/better-yield" },
  openGraph: {
    title: "Better Yield POS — Agricultural Retail | JRC Techworks",
    description,
    url: "/work/better-yield",
    siteName,
    type: "website",
    images: [{ url: image, alt: "Better Yield POS welcome and sign-in interface" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Better Yield POS — Agricultural Retail",
    description,
    images: [image],
  },
};

export default function BetterYieldCaseStudy() {
  return <CaseStudyPage project={projects[1]} nextProject={projects[0]} />;
}
