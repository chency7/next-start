import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于',
  description: '关于我和这个网站',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">关于</h1>
      {/* 这里添加关于页面内容 */}
    </div>
  );
}
