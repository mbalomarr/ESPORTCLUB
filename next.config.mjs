// Static export for GitHub Pages: https://mbalomarr.github.io/ESPORTCLUB/
const basePath = "/ESPORTCLUB";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  // Emit /events/index.html etc., which GitHub Pages serves reliably as /events/.
  trailingSlash: true,
  // GitHub Pages has no image optimization server.
  images: { unoptimized: true },
  // next/image and <img> don't get basePath added automatically; lib/utils.ts → asset() uses this.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default nextConfig;
