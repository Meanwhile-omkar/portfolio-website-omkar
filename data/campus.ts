import type { Photo } from "./gallery";

export interface Role {
  title: string;
  org: string;
  since: string;
  what: string;
}

export const roles: Role[] = [
  {
    title: "Vice Chairperson",
    org: "Trinity, the interdisciplinary student committee",
    since: "Jul 2025",
    what: "I run strategy and operations for college-wide events.",
  },
  {
    title: "Head of Marketing",
    org: "DJS S4DS, Society for Data Science",
    since: "Aug 2025",
    what: "I reach out to tech firms, startups and business leaders for partnerships.",
  },
];

// Trinity and S4DS photos. Put files in public/photos/campus and add a line here.
export const campusPhotos: Photo[] = [{ src: "/photos/campus/s4ds-chapter.jpg", alt: "DJS S4DS student chapter group photo", caption: "the S4DS chapter" }];
