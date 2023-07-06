/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  webpack5: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    config.resolve.fallback = { fs: false };
    return config;
  },
}