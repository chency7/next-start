import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '游戏',
  description: '有趣的小游戏集合',
};

export default function GamesPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">游戏</h1>
      {/* 这里添加游戏页面内容 */}
    </div>
  );
}
