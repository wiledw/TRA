/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Replace with your specific image domain
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
