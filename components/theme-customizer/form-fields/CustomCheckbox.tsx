'use client'
 
import * as React from 'react'
import clsx from 'clsx'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { BaseCheckboxProps, CheckboxSize } from './types'

const sizeClasses: Record<CheckboxSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export const CustomCheckbox = React.forwardRef<
  HTMLButtonElement,
  BaseCheckboxProps
>(
  (
    {
      label,
      showLabel = true,
      className,
      wrapperClassName,
      labelClassName,
      register,
      field,
      checked,
      onCheckedChange,
      disabled,
      size = 'md',
      colorType = 'default',
      ...props
    },
    ref
  ) => {
    const resolvedChecked = checked ?? field?.value ?? false

  const handleChange = async (state: boolean) => {
      const boolValue = state === true
      onCheckedChange?.(boolValue)
      field?.onChange?.(boolValue)
      await register?.onChange?.({
        target: { value: boolValue },
      })
    }

    return (
      <div className={clsx('flex items-center space-x-2', wrapperClassName)}>
        <Checkbox
          ref={ref ?? field?.ref ?? register?.ref}
          checked={resolvedChecked}
          onCheckedChange={handleChange}
          disabled={disabled}
          className={clsx(
            sizeClasses[size],
            'border-custom-border shadow-custom-sm rounded-sm border',
            'focus:ring-0 focus:outline-none',
            colorType === 'primary' &&
              'data-[state=checked]:bg-generic-primary! hover:border-generic-primary data-[state=checked]:border-generic-primary',
            className
          )}
          {...props}
        />
        {label && showLabel && (
          <Label className={clsx('text-sm font-normal', labelClassName)}>
            {label}
          </Label>
        )}
      </div>
    )
  }
)

CustomCheckbox.displayName = 'CustomCheckbox'
