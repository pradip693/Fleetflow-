'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { BaseCardProps } from './types'

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  onClick,
  ...props
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'border-border dark:bg-sidebar bg-background rounded-xl border shadow-sm transition-colors',
        onClick && 'hover:bg-muted/50 dark:hover:bg-muted/20 cursor-pointer',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}

      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
