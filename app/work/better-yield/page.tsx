import type { Metadata } from "next";
import CaseStudyPage from "@/components/case-study-page";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Better Yield POS Case Study | JRC Techworks",
  description: "Explore the Better Yield POS interface, highlighting checkout, stock records, and branch workflows.",
};

export default function BetterYieldCaseStudy() {
  return <CaseStudyPage project={projects[1]} nextProject={projects[0]} />;
}
