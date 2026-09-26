/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [{ source: "/tr/alim-talepleri", destination: "/tr/dogal-tas", permanent: true }];
  },
};

export default nextConfig;
