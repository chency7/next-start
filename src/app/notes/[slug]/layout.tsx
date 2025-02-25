import React from 'react';
import Link from 'next/link';

export default function NoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <nav className="flex items-center space-x-4 text-sm">
          <Link
            href="/notes"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← 返回笔记列表
          </Link>
        </nav>
      </div>

      <article className="rounded-lg bg-white p-6 shadow-sm prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-a:text-blue-600 prose-blockquote:border-zinc-300 prose-blockquote:text-zinc-700 prose-strong:text-zinc-900 prose-code:text-red-500 prose-pre:bg-zinc-900 prose-pre:text-zinc-100 dark:bg-zinc-800 prose-headings:dark:text-zinc-50 prose-p:dark:text-zinc-300 prose-a:dark:text-blue-400 prose-blockquote:dark:border-zinc-600 prose-blockquote:dark:text-zinc-300 prose-strong:dark:text-zinc-50 prose-code:dark:text-red-400 prose-pre:dark:bg-zinc-950 prose-pre:dark:text-zinc-200">
        {children}
      </article>
    </div>
  );
}
