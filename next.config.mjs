import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkToc from 'remark-toc';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 初始化需要参数的插件
const autolinkHeadings = [
  rehypeAutolinkHeadings, 
  { behavior: 'wrap' } // 以数组形式传递插件和参数
];

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // remarkGfm,
      // remarkToc,
      // remarkEmoji,
      // remarkMath,
    ],
    rehypePlugins: [
      // rehypePrism,
      // rehypeSlug,
      // autolinkHeadings, // 使用初始化后的插件
      // rehypeKatex,
    ],
    providerImportSource: '@mdx-js/react',
  },
});

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

// 合并 MDX 配置
export default withMDX(nextConfig);