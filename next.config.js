const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
  transpilePackages: [
    '@ant-design/pro-editor',
    '@ant-design/pro-chat',
    'react-intersection-observer',
  ],
  webpack: (config) => {
    // 定义构建时间
    const buildTime = new Date().toISOString();
    // 使用DefinePlugin插件定义一个全局常量
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_TIME': JSON.stringify(buildTime),
      })
    );

    return config;
  },
};

module.exports = nextConfig;
