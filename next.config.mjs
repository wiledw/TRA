/** @type {import('next').NextConfig} */
const nextConfig = {

  async headers() {
    return [
      {
        source: '/api/user/getPostsCurrent',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/api/admin/getPostsCurrent',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      }
    ];
  },






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



