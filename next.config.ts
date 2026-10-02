import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryBasePath = "/Low-Level-Design-Lab";

const nextConfig: NextConfig = {
  agentRules: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? repositoryBasePath : "",
};

export default nextConfig;
