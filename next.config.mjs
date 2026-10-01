/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow roster/game images hosted elsewhere (e.g. pasted image links).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
