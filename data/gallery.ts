export interface Photo {
  src: string;
  alt: string;
  caption: string;
}

// Wins wall: competitions, hackathons, conferences. Add a file to public/photos/wins and a line here.
export const winsPhotos: Photo[] = [
  { src: "/photos/wins/spotify-case-win.jpeg", alt: "Team with the winner's certificate at the Spotify case study", caption: "won the Spotify case · KJ Somaiya" },
  { src: "/photos/wins/ies-3-wins.jpg", alt: "Team holding three awards at IES Business School", caption: "3 awards in one day · IES" },
  { src: "/photos/wins/iiit-surat.jpeg", alt: "Team in front of IIIT Surat", caption: "IIIT Surat hackathon · 2nd runner-up" },
  { src: "/photos/wins/pitching-case.jpeg", alt: "Presenting data preprocessing steps on a screen", caption: "walking the judges through our data" },
  { src: "/photos/wins/midnight-discussion.jpeg", alt: "Team discussion late at night during a hackathon", caption: "2 a.m. team huddle" },
  { src: "/photos/wins/atharva-hackathon.jpeg", alt: "Team at the Atharva college hackathon", caption: "Atharva hackathon" },
  { src: "/photos/wins/judging-tcet.jpg", alt: "Judging round at TCET", caption: "judging round · TCET" },
  { src: "/photos/wins/redbull-code.jpeg", alt: "Laptop and an energy drink during a hackathon", caption: "red bull + code" },
];

export interface HobbyGroup {
  label: string;
  photos: Photo[];
}

// Omkar to add photos. Empty groups show taped empty frames.
export const hobbies: HobbyGroup[] = [
  { label: "trekking", photos: [] },
  { label: "music", photos: [] },
  { label: "travel", photos: [] },
];
