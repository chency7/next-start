import { useState, useEffect } from "react";
import FontFaceObserver from "fontfaceobserver";
import localforage from "localforage";
import useSWR from "swr";

type FontConfig = {
  name: string;
  weight?: number;
  style?: string;
};

const FONTS: FontConfig[] = [
  { name: "Pacifico" },
  { name: "Inter" },
  { name: "LXGW WenKai" },
  { name: "Cal Sans" },
];

const CACHE_KEY = "fontLoadingCache";
const LOAD_TIMEOUT = 5000;

// 创建字体加载器实例
const createFontLoader = (font: FontConfig) => {
  return new FontFaceObserver(font.name, {
    weight: font.weight,
    style: font.style,
  });
};

// 字体加载检测函数
const loadFonts = async (fonts: FontConfig[], timeout: number) => {
  try {
    await Promise.all(
      fonts.map(font =>
        createFontLoader(font).load(null, timeout)
      )
    );
    return true;
  } catch {
    return false;
  }
};

// SWR fetcher with caching
const fontFetcher = async () => {
  const cached = await localforage.getItem<{ timestamp: number; loaded: boolean }>(CACHE_KEY);

  // 24小时缓存有效期
  if (cached && Date.now() - cached.timestamp < 86400000) {
    return cached.loaded;
  }

  const loaded = await loadFonts(FONTS, LOAD_TIMEOUT);
  await localforage.setItem(CACHE_KEY, {
    timestamp: Date.now(),
    loaded
  });
  return loaded;
};

export function useFontLoading() {
  const { data: fontsLoaded, isValidating } = useSWR(
    CACHE_KEY,
    fontFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  );

  // 首次加载时显示 loading，后续 SWR 自动管理缓存
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (fontsLoaded !== undefined) {
      setInitialLoad(false);
    }
  }, [fontsLoaded]);

  return initialLoad || isValidating;
}