/** @type {import('next').NextConfig} */

// SSC paper PDFs live in a separate public repo (served by GitHub Pages) so this site's repo and
// deploys stay small. They are proxied under our own domain so links and search results show
// omkarharyan.paperkitelabs.com. Override SSC_PAPERS_ORIGIN to test against a local copy.
const SSC_PAPERS_ORIGIN = process.env.SSC_PAPERS_ORIGIN ?? "https://meanwhile-omkar.github.io/ssc-board-papers";

const nextConfig = {
  reactStrictMode: true,
  // Early name of the page; keep old links working.
  async redirects() {
    return [
      { source: "/ssc-boards-pyqs", destination: "/ssc-board-papers", permanent: true },
      { source: "/ssc-boards-pyqs/:path*", destination: "/ssc-board-papers/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/ssc-board-papers/pdf/:path*", destination: `${SSC_PAPERS_ORIGIN}/:path*` }],
    };
  },
};

module.exports = nextConfig;
