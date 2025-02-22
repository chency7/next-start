"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrollingTextProps {
  text: string;
  className?: string;
}

export function ScrollingText({ text, className = "" }: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [dimensions, setDimensions] = useState({ containerWidth: 0, textWidth: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;

    setTimeout(() => {
      console.log("container", container, "textElement", textElement, "text", text);
    }, 5000);

    if (!container || !textElement || !text) {
      setShouldScroll(false);
      return;
    }

    const updateDimensions = () => {
      const containerWidth = container?.offsetWidth;
      const textWidth = textElement.offsetWidth;
      setDimensions({ containerWidth, textWidth });

      setShouldScroll(textWidth > containerWidth);
    };

    // 初始更新
    updateDimensions();

    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);
    resizeObserver.observe(textElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  const { containerWidth, textWidth } = dimensions;

  return (
    <div ref={containerRef} className={className}>
      <motion.span
        ref={textRef}
        animate={{
          x: shouldScroll ? [0, -(textWidth - containerWidth)] : 0,
        }}
        transition={{
          duration: Math.max(5, textWidth / 50),
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 2,
          ease: "linear",
        }}
        className="inline-block"
        style={{ willChange: "transform" }}
      >
        {text}
      </motion.span>
    </div>
  );
}
