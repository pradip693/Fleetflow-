import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, CircleX, Check, X } from 'lucide-react'
import { BaseSelectProps } from './types'

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

const Label = ({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn('text-sm leading-none font-medium', className)}
    {...props}
  >
    {children}
  </label>
)

export const BaseSelect: React.FC<BaseSelectProps> = ({
  label,
  value,
  onChange = () => {},
  options,
  disabled = false,
  disabledOptions = new Set(),
  placeholder = 'Select an option',
  className,
  wrapperClassName,
  labelClassName,
  required = false,
  multiple = false,
  searchable = false,
  maxSelectedDisplay = 3,
  drodpDownClassName,
  hasError = false,
}) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : value ? [value] : []
    }
    return value ? [value as string] : []
  }, [value, multiple])

  const isSelected = (val: string) => selectedValues.includes(val)

  const toggleOption = (val: string) => {
    if (disabled || disabledOptions.has(val)) return
    const option = options.find((opt) => opt.value === val)
    if (option?.disabled) return

    if (multiple) {
      const newSelected = isSelected(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val]
      onChange(newSelected)
    } else {
      onChange(val)
      setOpen(false)
    }
  }

  const removeSelected = (
    val: string,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation()
    // --- FIX: Prevent removing a disabled option via its individual 'X' button ---
    if (disabled || !multiple || disabledOptions.has(val)) return
    const newSelected = selectedValues.filter((v) => v !== val)
    onChange(newSelected)
  }

  const clearSelection = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (disabled) return

    // --- FIX: Implement the intelligent clear logic ---
    if (multiple) {
      // Keep any value that is force-disabled by the parent.
      const newSelected = selectedValues.filter((val) =>
        disabledOptions.has(val)
      )
      onChange(newSelected)
    } else {
      // If it's a single select, just clear it.
      onChange('')
    }
  }

  const filteredOptions = useMemo(() => {
    if (!search) return options
    return options.filter((opt) =>
      typeof opt.label === 'string'
        ? opt.label.toLowerCase().includes(search.toLowerCase())
        : false
    )
  }, [options, search])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || !open) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHoveredIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHoveredIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (hoveredIndex >= 0 && hoveredIndex < filteredOptions.length) {
          toggleOption(filteredOptions[hoveredIndex].value)
        }
        break
      case 'Escape':
        setOpen(false)
        break
    }
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!e.defaultPrevented && !disabled) {
      setOpen(!open)
    }
  }

  useEffect(() => {
    if (open) {
      setSearch('')
      setHoveredIndex(-1)
      if (searchable) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }, [open, searchable])

  useEffect(() => {
    if (hoveredIndex >= 0 && listRef.current) {
      const hoveredElement = listRef.current.children[
        hoveredIndex
      ] as HTMLElement
      if (hoveredElement) {
        hoveredElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder
    if (!multiple) {
      return options.find((opt) => opt.value === selectedValues[0])?.label || ''
    }
    if (selectedValues.length === 1) {
      return options.find((opt) => opt.value === selectedValues[0])?.label || ''
    }
    return `${selectedValues.length} selected`
  }

  const getSelectedOptions = () => {
    return options.filter((opt) => selectedValues.includes(opt.value))
  }

  return (
    <div ref={containerRef} className={cn('space-y-1', wrapperClassName)}>
      {label && (
        <Label
          className={cn(
            'leading-custom-lg! tracking-custom-lg text-primary-grey text-sm font-medium',
            hasError && 'text-destructive',
            labelClassName
          )}
        >
          {required && <span className='text-destructive mr-1'>*</span>}
          {label}
        </Label>
      )}

      <div className='relative'>
        <button
          type='button'
          disabled={disabled}
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          className={cn(
            'ring-shadow-generic-primary! h-[50px] w-full rounded-md border px-3 py-1 text-sm transition-colors',
            'focus:border-generic-primary focus:ring-2 focus:outline-none',
            'hover:border-generic-primary hover:ring-2 hover:outline-none',
            'data-[state=open]:border-generic-primary',
            'dark:bg-input/85 flex items-center justify-between gap-2 text-left',
            disabled && 'bg-muted cursor-not-allowed opacity-50',
            open && 'border-generic-primary ring-2',
            className
          )}
          data-state={open ? 'open' : 'closed'}
        >
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {multiple &&
            selectedValues.length > 0 &&
            selectedValues.length <= maxSelectedDisplay ? (
              <div className='flex flex-wrap gap-1'>
                {getSelectedOptions()
                  .slice(0, maxSelectedDisplay)
                  .map((opt) => (
                    <span
                      key={opt.value}
                      className='bg-generic-green/10 text-generic-primary border-generic-primary/20 inline-flex max-w-[120px] items-center gap-1 rounded-full border px-2 py-1 text-xs'
                    >
                      <span className='truncate'>{opt.label}</span>
                      {/* --- FIX: Conditionally render the remove button --- */}
                      {!disabledOptions.has(opt.value) && (
                        <span
                          onClick={(e) => removeSelected(opt.value, e)}
                          className='hover:bg-generic-primary/20 cursor-pointer rounded-full p-0.5 transition-colors'
                          role='button'
                          tabIndex={disabled ? -1 : 0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              removeSelected(opt.value, e)
                            }
                          }}
                          aria-label={`Remove ${
                            typeof opt.label === 'string'
                              ? opt.label
                              : opt.value
                          }`}
                        >
                          <CircleX className='h-3 w-3' />
                        </span>
                      )}
                    </span>
                  ))}
                {selectedValues.length > maxSelectedDisplay && (
                  <span className='bg-foreground text-foreground inline-flex items-center rounded-full px-2 py-1 text-xs'>
                    +{selectedValues.length - maxSelectedDisplay} more
                  </span>
                )}
              </div>
            ) : (
              <span
                className={cn(
                  selectedValues.length === 0
                    ? 'text-foreground/60'
                    : 'text-foreground'
                )}
              >
                {getDisplayValue()}
              </span>
            )}
          </div>

          <div className='flex items-center gap-2'>
            {selectedValues.length > 0 && !disabled && (
              <span
                onClick={clearSelection}
                className='cursor-pointer text-gray-400 transition-colors hover:text-gray-600'
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    clearSelection(e)
                  }
                }}
                aria-label='Clear all selections'
              >
                <X className='h-4 w-4' />
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                open && 'rotate-180'
              )}
            />
          </div>
        </button>

        {open && !disabled && (
          <div
            className={cn(
              'border-custom-border bg-popover absolute z-50 mt-1 w-full rounded-md border shadow-lg',
              drodpDownClassName
            )}
          >
            {searchable && (
              <div className='border-b border-gray-200 p-2'>
                <input
                  ref={inputRef}
                  type='text'
                  className='border-custom-border focus:ring-shadow-generic-primary focus:border-generic-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
                  placeholder='Search options...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            <div
              ref={listRef}
              className='max-h-60 space-y-0.5 overflow-y-auto p-1'
            >
              {filteredOptions?.length > 0 ? (
                filteredOptions?.map((option, index) => {
                  const isOptionDisabled =
                    option.disabled || disabledOptions.has(option.value)
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        'cursor-pointer rounded-sm px-3 py-2 text-sm transition-colors',
                        'hover:bg-generic-primary/10 focus:bg-generic-primary/10',
                        'flex items-center gap-3',
                        isOptionDisabled &&
                          'cursor-not-allowed text-gray-400 opacity-50',
                        hoveredIndex === index && 'bg-generic-primary/10',
                        isSelected(option.value) &&
                          'bg-generic-primary/10 text-generic-primary'
                      )}
                      onClick={() =>
                        !isOptionDisabled && toggleOption(option.value)
                      }
                      onMouseEnter={() =>
                        !isOptionDisabled && setHoveredIndex(index)
                      }
                      onMouseLeave={() => setHoveredIndex(-1)}
                    >
                      {multiple && (
                        <div
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded border-2',
                            isSelected(option.value)
                              ? 'bg-generic-primary border-generic-primary'
                              : 'border-gray-300'
                          )}
                        >
                          {isSelected(option.value) && (
                            <Check className='h-3 w-3 text-white' />
                          )}
                        </div>
                      )}

                      <span className='flex-1'>{option.label}</span>

                      {!multiple && isSelected(option.value) && (
                        <Check className='text-generic-primary h-4 w-4' />
                      )}
                    </div>
                  )
                })
              ) : (
                <div className='text-muted-foreground px-3 py-6 text-center text-sm'>
                  No options available
                </div>
              )}
            </div>

            {multiple && selectedValues.length > 0 && (
              <div className='flex gap-2 border-t border-gray-200 p-2'>
                <button
                  type='button'
                  onClick={clearSelection}
                  className='flex-1 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200'
                >
                  Clear All
                </button>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='bg-generic-primary hover:bg-generic-primary/90 flex-1 rounded-md px-3 py-2 text-sm text-white transition-colors'
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
