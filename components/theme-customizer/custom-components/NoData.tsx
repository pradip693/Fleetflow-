'use client'

import { Inbox, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NoDataProps } from './types'

export const NoData = ({
  title = 'No Data Found',
  description = 'There is currently no data to display. Please check back later.',
  fullScreen = false,
  isError = false,
  className,
}: NoDataProps & { fullScreen?: boolean; isError?: boolean }) => {
  return (
    <div
      className={cn(
        'animate-fadeIn flex flex-col items-center justify-center text-center transition-all',
        fullScreen
          ? 'bg-background h-screen w-full px-6'
          : 'w-full rounded-2xl p-10 shadow-sm hover:shadow-md',
        className
      )}
    >
      <div
        className={cn(
          'mb-4 rounded-full p-4',
          isError ? 'bg-red-100' : 'bg-gray-100'
        )}
      >
        {isError ? (
          <AlertTriangle className='text-destructive h-10 w-10' />
        ) : (
          <Inbox
            className={cn(
              'h-10 w-10',
              isError ? 'text-destructive' : 'text-gray-500'
            )}
          />
        )}
      </div>

      {title && (
        <h2
          className={cn(
            'text-lg font-semibold',
            isError ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className='text-muted-foreground mt-1 max-w-md text-sm'>
          {description}
        </p>
      )}
    </div>
  )
}
