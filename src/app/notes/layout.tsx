import React from 'react';
import Link from 'next/link';
import { ThemeSwitch } from '@/components/theme-switch';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="m-auto max-w-4xl px-6 py-12">
        <header className="mb-12 transform space-y-6 transition-all duration-500 ease-in-out hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <nav className="group relative">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
                <span>返回首页</span>
              </Link>
            </nav>
            <ThemeSwitch />
          </div>
          <div className="space-y-4">
            <h1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100">
              笔记系统
            </h1>
            <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              这里记录了我的学习笔记和技术分享，希望能帮助到你。
            </p>
          </div>
        </header>
        <main className="transform transition-all duration-500 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}
