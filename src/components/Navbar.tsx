'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', name: '主页' },
    { path: '/notes', name: '随记' },
    { path: '/games', name: '游戏' },
    { path: '/about', name: '关于' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-2 py-4 font-semibold transition duration-300 hover:text-blue-500 ${
                  pathname === item.path
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
