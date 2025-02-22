"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "chency") {
      document.cookie = "projectAuth=true; path=/";
      router.push("/projects");
      onClose();
    } else {
      setError("密码错误");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative w-80 rounded-xl bg-zinc-900/90 p-6 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-800"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-200">请输入访问密码</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-2 text-zinc-200 outline-none ring-pink-400 focus:ring-2"
                placeholder="输入密码..."
                autoFocus
              />
              {error && <p className="text-sm text-pink-400">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-pink-400 py-2 text-white transition-colors hover:bg-pink-500"
              >
                确认
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
