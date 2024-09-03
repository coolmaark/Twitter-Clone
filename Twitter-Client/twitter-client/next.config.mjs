/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/104413900?v=4',
      }],
    // domains : [""],
  },
};

export default nextConfig;
