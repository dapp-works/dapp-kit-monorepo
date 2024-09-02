// Importing env files here to validate on build
// import "./src/env.mjs";
// import "@acme/auth/env.mjs";

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  // swcMinify: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [ "@dappworks/kit"],
  experimental: {
    optimizePackageImports: ["@dappworks/kit"],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default bundleAnalyzer(config);
