'use client'

import WorkForceLogo from '@public/WorkSafe-no-text-logo.png'
import { cn } from '@/lib/utils'
import { LogoLoaderProps } from './types'
import Image from 'next/image'

export default function LogoLoader({ fullScreen, className }: LogoLoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen
          ? 'flex min-h-[calc(100dvh-200px)] items-center justify-center'
          : 'h-50 w-full py-10',
        className
      )}
    >
      <Image
        alt='workSAFE loader'
        src={WorkForceLogo}
        className='text-muted-foreground h-14 w-14'
      />

      <div className='flex space-x-1.5'>
        <span className='bg-generic-primary-dark h-3 w-3 animate-bounce rounded-full [animation-delay:-0.2s]'></span>
        <span className='bg-generic-primary-dark/75 h-3 w-3 animate-bounce rounded-full [animation-delay:-0.15s]'></span>
        <span className='bg-generic-primary-dark/50 h-3 w-3 animate-bounce rounded-full'></span>
      </div>
    </div>
  )
}
