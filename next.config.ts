import type { NextConfig } from "next";

// Cache Components (on by default in new Next.js 16 apps) is off: every page here
// shows one signed-in user's own data, so there's little to cache, and it would
// require a loading boundary around every page that checks who is logged in.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
