"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      title: "🌟 特性",
      items: [
        "优雅的打字机动画效果",
        "深色主题设计",
        "基于 Next.js 14 的 App Router",
        "响应式设计",
        "自定义字体加载",
        "粒子动画背景",
      ],
    },
    {
      title: "🛠 技术栈",
      items: ["Next.js 14", "Tailwind CSS", "ContentLayer + MDX", "Framer Motion", "Upstash Redis"],
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-16 top-4 z-50 rounded-full p-3 text-zinc-400 transition-all hover:bg-zinc-900 hover:text-zinc-100"
        aria-label="About"
      >
        <MoreHorizontal size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="z-5000 fixed inset-y-0 right-0 w-80 p-6 text-zinc-400 shadow-xl backdrop-blur-sm"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-zinc-800"
            >
              <X size={20} />
            </button>

            <div className="mt-8 space-y-6">
              {menuItems.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-lg font-semibold text-zinc-200">{section.title}</h2>
                  <ul className="space-y-2 pl-4">
                    {section.items.map((item) => (
                      <li key={item} className="text-sm hover:text-zinc-200">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="pt-4">
                <Link
                  href="https://github.com/chency7"
                  target="_blank"
                  className="text-sm text-zinc-400 hover:text-zinc-200"
                >
                  GitHub →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
