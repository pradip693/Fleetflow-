'use client'

import clsx from 'clsx'
import type { BaseInputProps } from './types'
import { Input } from '@/components/ui/input'
import CustomFormLable from './CustomFormLable'
import { cn } from '@/lib/utils'

const CustomInput: React.FC<BaseInputProps> = ({
  label,
  showLabel = false,
  className,
  wrapperClassName,
  labelClassName,
  register,
  field,
  disabled,
  inputSize = 'large',
  required = false,
  maxLength,
  showTextLength = false,
  uiVariant = 'default',
  ...props
}) => {
  const inputProps = {
    ...props,
    disabled: disabled,
  }

  const value = field?.value ?? props.value ?? ''

  return (
    <div className={clsx('space-y-2', wrapperClassName)}>
      {label && showLabel && (
        <CustomFormLable
          label={label}
          labelClassName={labelClassName}
          required={required}
        />
      )}
      <div className='relative'>
        <Input
          {...inputProps}
          {...register}
          {...field}
          value={value}
          maxLength={maxLength ? maxLength : undefined}
          className={
            cn(
              'w-full shadow-custom-light-sm! px-4 text-sm placeholder:text-sm',
              className,
              uiVariant == 'rounded' && 'rounded-full border-accent',
              uiVariant == 'shadow' && 'shadow-custom-light-sm!',
              uiVariant=='glass'&& 'bg-white/5 backdrop-blur-lg border border-white/10 placeholder:text-white/65 text-white focus:bg-white/25 focus:border-white/40',
              uiVariant == 'default' && 'rounded-md outline-0 focus-visible:shadow-custom-light-sm! outline-none focus-visible:outline-none',
              inputSize == 'large'
                ? 'h-[50px]'
                : inputSize == 'small'
                  ? 'h-10'
                  : 'h-11')
          }
        />
        {showTextLength && (
          <span className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-xs tabular-nums peer-disabled:opacity-50'>
            {String(value).length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

export default CustomInput
