/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      { source: "/tr/alim-talepleri", destination: "/tr/dogal-tas", permanent: true },
      { source: "/en/guide/turkish-marble-types", destination: "/en/guide/turkiye-mermer-cesitleri", permanent: true }
    ];
  },
};

export default nextConfig;
