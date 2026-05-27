/** @type {import('next').NextConfig} */

const apiUrl = process.env.API_URL ?? "https://form-builder-trpc-hackthron-project.vercel.app/";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "shakanksh.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/trpc/:path*",
        destination: `${apiUrl}/trpc/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/f/:slug*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;