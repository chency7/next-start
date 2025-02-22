import { useState, useEffect } from "react";

const FONTS = [
  { name: "Pacifico", weight: 400 },
  { name: "Inter", weight: 400 },
  { name: "LXGW WenKai", weight: 400 },
  { name: "Cal Sans", weight: 400 },
] as const;

const CACHE_KEY = "fontLoaded";
const CACHE_TIME_KEY = "fontLoadTime";
const ONE_DAY = 24 * 60 * 60 * 1000; // 缓存有效期为 1 天

export function useFontLoading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // 防止组件卸载后继续更新状态

    const checkCachedFonts = () => {
      try {
        const fontLoadedBefore = localStorage.getItem(CACHE_KEY);
        const lastLoadTime = localStorage.getItem(CACHE_TIME_KEY);

        if (fontLoadedBefore === "true" && lastLoadTime) {
          const timeDiff = Date.now() - Number(lastLoadTime);
          return timeDiff < ONE_DAY; // 如果缓存未过期，返回 true
        }
        return false;
      } catch (error) {
        console.warn("Error accessing localStorage:", error);
        return false;
      }
    };

    const checkFontsLoaded = () => {
      if (!isMounted) return;

      try {
        // 使用 document.fonts.check() 检测每个字体是否加载完成
        const results = FONTS.map((font) => {
          const fontString = `${font.weight} 12px ${font.name}`; // 构造字体字符串
          return document.fonts.check(fontString); // 检查字体是否可用
        });

        const allLoaded = results.every(Boolean); // 检查所有字体是否都加载完成

        if (allLoaded) {
          console.log("All fonts are loaded successfully.");
          // 缓存字体加载状态
          try {
            localStorage.setItem(CACHE_KEY, "true");
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          } catch (error) {
            console.warn("Error saving to localStorage:", error);
          }
        } else {
          console.warn("Some fonts failed to load.");
        }

        setLoading(!allLoaded); // 更新 loading 状态
      } catch (error) {
        console.warn(`Error checking font loading status: ${error}`);
        setLoading(false); // 如果发生错误，假设字体未加载完成
      }
    };

    // 检查缓存
    const cached = checkCachedFonts();
    if (cached) {
      console.log("Fonts are already loaded (from cache).");
      setLoading(false);
    } else {
      // 监听字体加载事件
      document.fonts.ready.then(() => {
        if (isMounted) {
          checkFontsLoaded();
        }
      });
    }

    return () => {
      isMounted = false; // 防止组件卸载后继续更新状态
    };
  }, []);


  setTimeout(() => {
    setLoading(false)
  }, 5000)

  return loading;
}
