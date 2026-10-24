import { education, profile } from "@/data/profile";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

// schema.org data for search engines (Person + WebSite + ProfilePage). Invisible on the page;
// everything here is already stated in the visible content.
export default function StructuredData() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    givenName: profile.first,
    familyName: profile.name.split(" ").slice(1).join(" "),
    url: SITE_URL,
    image: `${SITE_URL}/character/hero.webp`,
    email: `mailto:${profile.contact.email}`,
    description: SITE_DESCRIPTION,
    jobTitle: "Data Science Engineering student",
    address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.college, address: { "@type": "PostalAddress", addressLocality: education.city, addressCountry: "IN" } },
    knowsAbout: ["Artificial intelligence", "Machine learning", "Data science", "Large language models", "Retrieval-augmented generation", "Product management", "Business strategy"],
    sameAs: [profile.contact.linkedin, profile.contact.github],
  };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: profile.name, inLanguage: "en", publisher: { "@id": `${SITE_URL}/#person` } },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: `${profile.name} · Data Science & Strategy`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
  // "<" escaped so the JSON can never close the script tag early.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
