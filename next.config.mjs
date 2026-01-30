/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only use standalone output for Docker/Cloud Run deployments
  // Vercel doesn't need this and it can cause build issues
  ...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' } : {}),
};

export default nextConfig;

