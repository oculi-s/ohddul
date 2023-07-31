/** @type {import('next').NextConfig} */

// markdown을 렌더링에 사용할 수 있음.
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

const withTM = require('next-transpile-modules')([
  'd3-array',
  'd3-format',
  'd3-time',
  'd3-time-format',
  'react-financial-charts',
  '@react-financial-charts/annotations',
  '@react-financial-charts/axes',
  '@react-financial-charts/coordinates',
  '@react-financial-charts/core',
  '@react-financial-charts/indicators',
  '@react-financial-charts/interactive',
  '@react-financial-charts/scales',
  '@react-financial-charts/series',
  '@react-financial-charts/tooltip',
  '@react-financial-charts/utils',
]);

const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
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

module.exports = withTM(withMDX(nextConfig));