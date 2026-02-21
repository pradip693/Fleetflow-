'use client'

import React from 'react'
import clsx from 'clsx'
import type { TypographyProps } from './types'
import { cn } from '@/lib/utils'

// font size: 40px
const ExtraLargeTitleText: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h1',
  onClick,
}) => {
  return (
    <Component
      className={cn(
        'text-3xl leading-normal font-semibold md:text-4xl lg:text-[40px]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// font size: 36px
const LargeTitleText: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h2',
  onClick,
}) => {
  return (
    <Component
      className={cn(
        'text-[28px] leading-normal font-semibold md:text-3xl lg:text-4xl',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// font size: 30px
const MediumTitleText: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h3',
  onClick,
}) => {
  return (
    <Component
      className={cn('text-[24px] font-medium md:text-[28px] lg:text-3xl', className)}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// font size: 20px
const LargeText: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h4',
  onClick,
}) => {
  return (
    <Component
      className={cn('text-base md:text-[20px]', className)}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// font size: 18px
const MediumText: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
  onClick,
}) => {
  return (
    <Component
      className={cn('text-base xs:text-lg leading-normal', className)}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// font size: 16px
const BaseText: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
  onClick,
}) => {
  return (
    <Component
      className={cn('text-base leading-normal', className)}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

// font size: 14px
const SmallText: React.FC<TypographyProps> = ({
  children,
  className = '',
  as: Component = 'p',
  onClick,
}) => {
  return (
    <Component
      className={cn('text-sm leading-normal', className)}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

export {
  ExtraLargeTitleText,
  LargeTitleText,
  MediumTitleText,
  LargeText,
  MediumText,
  BaseText,
  SmallText
}
