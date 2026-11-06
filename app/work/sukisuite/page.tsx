import type { Metadata } from "next";
import CaseStudyPage from "@/components/case-study-page";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "SukiSuite Case Study | JRC Techworks",
  description: "Explore SukiSuite, a booking, client management, and follow-up product showcased by JRC Techworks.",
};

export default function SukiSuiteCaseStudy() {
  return <CaseStudyPage project={projects[0]} nextProject={projects[1]} />;
}
