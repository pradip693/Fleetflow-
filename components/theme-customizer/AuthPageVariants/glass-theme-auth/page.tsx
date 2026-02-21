'use client';

import Image from "next/image";
import BackgroundImage from '@public/auth/background-gradient-minimalist-design.png'
import { JSX } from "react";

export default function GlassThemeAuthLayout({children}: {
  children: React.ReactNode;
}): JSX.Element{

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 flex overflow-hidden justify-center items-center">
        <Image
          src={BackgroundImage}
          alt='theme-image'
          fill
          priority
          className='w-full h-full'
        />
      </div>

      {children}
    </div>
  );
}
