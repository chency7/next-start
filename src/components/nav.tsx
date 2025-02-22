"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PasswordModal from "./PasswordModal";
// import { useRouter } from "next/navigation";

export const Navigation: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // const handleProjectClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (!document.cookie.includes("projectAuth=true")) {
  //     setIsPasswordModalOpen(true);
  //   } else {
  //     router.push("/projects");
  //   }
  // };

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b  backdrop-blur duration-200  ${
          isIntersecting ? "border-transparent bg-zinc-900/0" : "bg-zinc-900/500 border-zinc-800"
        }`}
      >
        <div className="container mx-auto flex flex-row items-center justify-between p-6">
          {/* <div className="flex gap-8 justify-between">
            <Link
              href="/projects"
              onClick={handleProjectClick}
              className="duration-200 text-zinc-400 hover:text-zinc-100"
            >
              项目
            </Link>
            <Link href="/contact" className="duration-200 text-zinc-400 hover:text-zinc-100">
              博客
            </Link>
          </div> */}

          <Link href="/" className="text-zinc-300 duration-200 hover:text-zinc-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </header>
  );
};
