import path from 'path';
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // 关闭 turbopack
    webpackBuildWorker: false
  },
  webpack: (config: WebpackConfig) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    // 添加重试机制
    config.output = {
      ...config.output,
      // @ts-ignore
      retryChunkLoad: true,
      chunkLoadTimeout: 30000,
    };


    return config;
  },
  // 生产环境的源码映射，便于调试
  productionBrowserSourceMaps: true,
  // 严格模式
  reactStrictMode: true,
  // 配置允许的图片域名
  images: {
    domains: [],
  },
  // 编译时环境变量
  env: {
    APP_ENV: process.env.APP_ENV || 'development',
  },
};

export default nextConfig;
