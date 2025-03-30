/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icons.duckduckgo.com',
        port: '', // Usually empty string
        pathname: '/ip3/**', // Allow any path under /ip3/
      },
      // You can add other trusted image domains here later if needed
      // Example for Google Favicons (if you switch later):
      // {
      //   protocol: 'https',
      //   hostname: 'www.google.com',
      //   port: '',
      //   pathname: '/s2/favicons/**',
      // },
    ],
  },
};

export default nextConfig; 