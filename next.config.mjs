/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      { source: "/tr/tedarikci-talepleri", destination: "/tr/alim-talepleri", statusCode: 301 },
      { source: "/en/guide/turkish-marble-types", destination: "/en/guide/turkiye-mermer-cesitleri", permanent: true }
    ];
  },
};

export default nextConfig;
