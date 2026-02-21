'use client'

import { useState, useMemo } from 'react'
import clsx from 'clsx'
import { ChevronsUpDown, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { UserSelectDropdownProps } from './types'

export function UserSelectDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select user',
  disabled,
  wrapperClassName,
  labelClassName,
  className,
  dropDownClassName,
  required,
  hasError,
  onAddCustomer,
}: UserSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = useMemo(
    () => options.find((x) => x.id === value),
    [value, options]
  )

  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            variant='outline'
            disabled={disabled}
            className={cn(
              'h-12.5 w-full justify-between font-normal disabled:opacity-75',
              hasError && 'border-red-500',
              className
            )}
          >
            <p className='flex gap-1'>
              {selectedOption ? (
                <>
                  <span>{selectedOption.name}</span>
                  <span className='text-muted-foreground'>
                    {selectedOption.phone && `(${selectedOption.phone})`}
                  </span>
                </>
              ) : (
                <span className='text-muted-foreground'>{placeholder}</span>
              )}
            </p>
            <ChevronsUpDown className='h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align='start'
          className={cn(
            'w-[300px] min-w-[220px] px-0 pt-0 pb-6',
            dropDownClassName
          )}
        >
          <Command loop>
            <CommandInput placeholder='Search...' />

            <CommandList className='relative space-y-1.5'>
              <CommandEmpty>
                <div className='px-4 py-6 text-center text-sm'>
                  No user found
                </div>
              </CommandEmpty>

              <CommandGroup>
                {options.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      onChange?.(user.id)
                      setOpen(false)
                    }}
                    className='gap-1.5'
                  >
                    <div className='flex flex-col gap-0.5'>
                      <span>{user.name}</span>
                      <span className='text-muted-foreground text-xs'>
                        {user.phone}
                      </span>
                    </div>
                  </CommandItem>
                ))}
                {onAddCustomer && (
                  <CommandItem
                    onSelect={() => {
                      if (onAddCustomer) {
                        onAddCustomer()
                      }
                      setOpen(false)
                    }}
                    className='bg-main-container fixed bottom-0 left-0 mt-1 w-full'
                  >
                    <div className='text-generic-primary m-auto flex items-center justify-center gap-1'>
                      <PlusIcon className='text-generic-primary' />
                      <span>Add detail</span>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
