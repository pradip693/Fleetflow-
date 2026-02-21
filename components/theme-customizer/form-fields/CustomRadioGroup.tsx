'use client'

import * as React from 'react'
import clsx from 'clsx'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { CustomRadioGroupProps } from './types'

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
  wrapperClassName,
  labelClassName,
  className,
  required = false,
}) => {
  return (
    <div className={clsx('space-y-1', wrapperClassName)}>
      {label && (
        <Label
          className={clsx(
            'leading-custom-lg! tracking-custom-lg text-primary-grey text-sm font-medium',
            labelClassName
          )}
        >
          {required && <span className='text-destructive -mr-1'>*</span>}
          {label}
        </Label>
      )}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={clsx('flex flex-col gap-2 py-3', className)}
        disabled={disabled}
      >
        {options.map((opt) => (
          <div key={opt.value} className='flex items-center space-x-2'>
            <RadioGroupItem
              id={opt.value}
              value={opt.value}
              className={clsx(
                'rounded-full border transition-colors',
                'focus:ring-2 focus:ring-offset-0',
                'data-[state=checked]:border-generic-primary data-[state=checked]:text-generic-primary data-[state=checked]:ring-shadow-generic-primary'
              )}
            />
            <Label
              htmlFor={opt.value}
              className='cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
