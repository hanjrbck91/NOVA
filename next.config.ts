import type { NextConfig } from "next";

// GitHub Pages serves the site from a sub-path (https://<user>.github.io/<repo>/).
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH (e.g. "/nova-3d"); locally it
// is unset, so dev and plain builds keep serving from "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML/JS/CSS export to `out/` (no Node server on GitHub Pages).
  output: "export",
  basePath,
};

export default nextConfig;
