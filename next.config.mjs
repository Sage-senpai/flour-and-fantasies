/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove reactCompiler - not supported in Next.js 14
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
};

export default nextConfig;