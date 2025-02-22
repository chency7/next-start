'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import Particles from '@/components/particles';
import { Github } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const navigation = [
  { name: '随记', href: '/views/projects' },
  // { name: "博客", href: "/views/contact" },
  // { name: "关于", href: "/views/ablut" },
];

export default function ThemeDark() {
  const controls = useAnimation();
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const scrollThreshold = 100; // 滚动阈值

  useEffect(() => {
    const handleScroll = () => {
      setScrollProgress(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fillPercentage = Math.min((scrollProgress / scrollThreshold) * 100, 100);

  useEffect(() => {
    controls.start({
      clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
      transition: { duration: 0.3, ease: 'easeOut' },
    });
  }, [fillPercentage, controls]);

  const onTitleClick = () => {
    // 处理标题点击事件
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/10 to-black">
      <nav className="animate-fade-in mb-20">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-l text-zinc-500 duration-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>

      <div className="animate-glow animate-fade-left hidden h-px w-screen bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />

      <div className="relative">
        {/* 背景文字（灰色） */}
        <h1
          onClick={onTitleClick}
          className="font-pacifico z-10 flex h-[300px] w-fit cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap bg-gradient-to-r from-zinc-500 to-zinc-500 bg-clip-text px-16 text-4xl text-transparent sm:text-6xl md:text-9xl"
        >
          Chency
        </h1>
        {/* 渐变填充文字 */}
        <motion.h1
          onClick={onTitleClick}
          animate={controls}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          className="font-pacifico absolute inset-0 z-20 flex h-[300px] w-fit cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap bg-gradient-to-r from-white via-pink-500 to-white bg-clip-text px-16 text-4xl text-transparent sm:text-6xl md:text-9xl"
        >
          Chency
        </motion.h1>
      </div>

      <div className="animate-glow animate-fade-right hidden h-px w-screen bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />

      <Particles className="animate-fade-in absolute inset-0 -z-10" quantity={500} />

      <div className="animate-fade-in mt-16 text-center">
        <h2 className="text-sm text-zinc-500">
          <Github className="mr-1 inline h-4 w-4" />
          <Link
            target="_blank"
            href="https://github.com/chency7"
            className="duration-500 hover:text-zinc-300 hover:underline"
          >
            chency.github
          </Link>
        </h2>
      </div>
    </div>
  );
}
