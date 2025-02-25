'use client';

import Lottie from 'lottie-react';
import loadingAnimation from '../../public/json/loading-dark.json';

export default function Loading() {
  return (
    <div className="w-full h-screen absolute inset-0 z-50 flex items-center justify-center bg-[rgb(17,17,17)] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-xl">
        <div className="h-[500px] w-[500px]">
          <Lottie animationData={loadingAnimation} loop={true} autoplay={true} />
        </div>
      </div>
    </div>
  );
}
