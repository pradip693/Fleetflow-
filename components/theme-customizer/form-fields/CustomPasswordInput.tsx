'use client'

import clsx from 'clsx'
import type { PasswordInputProps } from './types'
import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from '@/lib/utils'
import CustomFormLable from './CustomFormLable'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CustomPasswordInput({
  name,
  label,
  placeholder = 'Password',
  className = '',
  disabled = false,
  showLabel = false,
  labelClassName = '',
  inputSize = 'large',
  required = false,
  uiVariant = 'default',
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className={clsx('space-y-2', className)}>
      {label && showLabel && (
        <CustomFormLable
          label={label}
          labelClassName={labelClassName}
          required={required}
        />
      )}
      <InputGroup className={
        cn(inputSize == 'large'
          ? 'h-[50px]'
          : inputSize == 'small'
            ? 'h-10'
            : 'h-11',
          uiVariant == 'rounded' && 'rounded-full border-accent',
          uiVariant == 'shadow' && 'shadow-custom-light-sm!',
          uiVariant == 'glass' && 'bg-white/5 backdrop-blur-lg border border-white/10 text-white focus:bg-white/25 focus:border-white/40',
          uiVariant == 'default' && 'rounded-md outline-0 focus-visible:shadow-custom-light-sm! outline-none focus-visible:outline-none',
        )}>
        <InputGroupInput
          id={name}
          disabled={disabled}
          autoComplete='off'
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={
            cn(
              'w-full h-full shadow-custom-light-sm! rounded-md px-4 outline-0 focus-visible:shadow-custom-light-sm! text-sm outline-none placeholder:text-sm focus-visible:outline-none',
              className,
              uiVariant == 'glass' && 'placeholder:text-white/65 text-white focus:bg-white/25 focus:border-white/40',

            )
          }
          onPaste={(e) => {
            e.preventDefault()
            return false
          }}
        />
        <InputGroupAddon align="inline-end">
          <Button
            type='button'
            onClick={() => {
              setShow(!show)
            }}
            variant='ghost'
            size='icon'
            className='absolute top-1/2 right-2 -translate-y-1/2 bg-transparent!'
            aria-label={show ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {show ? (
              <EyeOffIcon size={16} className={cn('text-muted-foreground',
                uiVariant == 'glass' && 'text-white/50 focus:text-white'
              )} />
            ) : (
              <EyeIcon size={16} className={cn('text-muted-foreground',
                uiVariant == 'glass' && 'text-white/50 focus:text-white'
              )} />
            )}
          </Button>
        </InputGroupAddon>
      </InputGroup>

    </div>
  )
}
