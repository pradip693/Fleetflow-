'use client'

import React from 'react'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CustomBaseButtonProps } from './types'
import { cn } from '@/lib/utils'

export const SubmitButton = ({
  content,
  className,
  onClick,
  loading = false,
  uiVariant = 'default',
  asChild = false,
  ...props
}: CustomBaseButtonProps & React.ComponentPropsWithoutRef<typeof Button>) => {
  return (
    <Button
      className={cn(
        'flex h-12 transform cursor-pointer items-center gap-2.5 px-4 py-2',
        'hover:scale-95 hover:bg-linear-to-br hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 hover:shadow-sm hover:shadow-primary/40 transition-all duration-500',
        className,
        uiVariant == 'rounded' && 'rounded-full',
        uiVariant == 'default' && 'rounded-[10px]',
        uiVariant == 'glass' && ' bg-linear-to-r to-main-primary-dark from-main-primary-dark/90 hover:from-main-primary-dark hover:to-main-primary-dark/90 text-white font-semibold'
      )}
      onClick={onClick}
      asChild={asChild}
      {...props}
      disabled={loading}

    >
      <div className='flex items-center justify-center gap-3'>
        <p className={'leading-custom-md text-lg font-normal'}>{content}</p>
        {loading && <LoaderCircle className='animate-spin' size={60} />}
      </div>
    </Button>
  )
}
