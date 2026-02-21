'use client'

import React from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { CustomBaseButtonProps } from './types'

export const CustomBaseButton = ({
  content,
  className,
  onClick,
  loading = false,
  asChild = false,
  icon,
  iconPosition = 'left',
  ...props
}: CustomBaseButtonProps & React.ComponentPropsWithoutRef<typeof Button>) => {

  return (
    <Button
      className={cn(
        'flex transform cursor-pointer items-center border transition hover:scale-105 hover:opacity-90 active:scale-95 active:brightness-90',
        'gap-2.5 rounded-[10px] px-4 py-2',
        className
      )}
      onClick={onClick}
      asChild={asChild}
      {...props}
      disabled={loading || props?.disabled}
    >
      <div className={'flex items-center justify-center gap-2'}>
        {icon && iconPosition === 'left' && (
          <span className='flex items-center'>{icon}</span>
        )}

        <p className='leading-custom-md text-base font-normal'>{content}</p>

        {icon && iconPosition === 'right' && (
          <span className='flex items-center'>{icon}</span>
        )}

        {loading && <LoaderCircle className='animate-spin' size={60} />}
      </div>
    </Button>
  )
}
