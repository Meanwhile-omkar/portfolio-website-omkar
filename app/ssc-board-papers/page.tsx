import { MainView, mainMetadata } from "@/components/ssc/views";

// English version. Marathi lives at /ssc-board-papers/mr.
export const metadata = mainMetadata("en");

export default function SscBoardPapersPage() {
  return <MainView lang="en" />;
}
