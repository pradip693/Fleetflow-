'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { BasicDetailsCard } from './types'

export function BasicDetailsCard({
  children,
  className,
}: Readonly<BasicDetailsCard>) {
  return (
    <Card className={cn('border-none p-0 shadow-none', className)}>
      <CardContent className='grid grid-cols-1 gap-3.5 px-0 sm:grid-cols-2 xl:grid-cols-3'>
        {children}
      </CardContent>
    </Card>
  )
}
