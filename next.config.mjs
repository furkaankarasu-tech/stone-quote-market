/** @type {import('next').NextConfig} */
const noStore = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },
  { key: "Pragma", value: "no-cache" },
  { key: "Expires", value: "0" }
];

const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      { source: "/:locale(tr|en|zh|ar)", headers: noStore },
      { source: "/:locale(tr|en|zh|ar)/:path*", headers: noStore },
      { source: "/legacy/:path*", headers: noStore }
    ];
  }
};
export default nextConfig;
