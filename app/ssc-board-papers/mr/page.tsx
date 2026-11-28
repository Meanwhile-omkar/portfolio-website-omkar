import { MainView, mainMetadata } from "@/components/ssc/views";

// Marathi version of /ssc-board-papers: rendered in Marathi on the server, so Google indexes the Marathi text.
export const metadata = mainMetadata("mr");

export default function SscBoardPapersMarathiPage() {
  return <MainView lang="mr" />;
}
