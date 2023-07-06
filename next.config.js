/** @type {import('next').NextConfig} */
const { withMinifyClassnamesConfig } = require('nextjs-plugin-minify-css-classname');

module.exports = withMinifyClassnamesConfig({
  enabled: process.env.NODE_ENV === 'production',
})({
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
})