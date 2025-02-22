import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '随记',
  description: '我的随记与思考',
};

export default function NotesPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">随记</h1>
      {/* 这里添加随记页面内容 */}
    </div>
  );
}
