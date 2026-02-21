'use client'
 
import { useRef } from 'react'
import clsx from 'clsx'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { SearchInputProps } from './types'

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  showLabel = false,
  wrapperClassName,
  labelClassName,
  className,
  disabled,
  inputSize = 'default',
  required = false,
  value = '',
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange?.('')
    inputRef.current?.focus()
  }

  return (
    <div className={clsx('space-y-1', wrapperClassName)}>
      {label && showLabel && (
        <Label className={clsx('text-sm font-medium', labelClassName)}>
          {required && <span className='text-destructive'>*</span>}
          {label}
        </Label>
      )}

      <InputGroup
        className={clsx(
          'shadow-custom-light-sm! focus-visible:shadow-custom-light-sm! relative outline-none placeholder:text-sm focus-visible:outline-none',
          className,
          inputSize === 'large'
            ? 'h-[50px]'
            : inputSize === 'small'
              ? 'h-10'
              : 'h-11'
        )}
      >
        <InputGroupInput
          value={value}
          ref={inputRef}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={clsx('border-none pr-8 text-sm outline-none')}
          {...props}
        />

        {value && (
          <InputGroupAddon align='inline-end'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleClear}
            >
              <X className='text-muted-foreground h-4 w-4' />
              <span className='sr-only'>Clear search</span>
            </Button>
          </InputGroupAddon>
        )}

        <InputGroupAddon>
          <Search className='text-muted-foreground h-4 w-4' />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default SearchInput
