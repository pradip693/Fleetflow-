import clsx from 'clsx'
import { Label } from '@/components/ui/label'
import type { TimePickerProps } from '../type'
import { TimePicker } from '../ui/time-picker'

interface BaseTimePickerProps extends TimePickerProps {
  label?: string
  showLabel?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  inputSize?: 'large' | 'medium' | 'small'
  error?: string
}

const BaseTimePicker: React.FC<BaseTimePickerProps> = ({
  placeholder = 'Select time',
  required = false,
  className,
  wrapperClassName,
  label,
  showLabel = false,
  labelClassName,
  inputSize = 'large',
  disabled,
  error,
  ...props
}) => {
  return (
    <div className={clsx('space-y-1', wrapperClassName)}>
      {label && showLabel && (
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

      <TimePicker
        {...props}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'shadow-custom-light-sm! focus-visible:shadow-custom-light-sm! border-input w-full border bg-white text-sm outline-none placeholder:text-sm hover:bg-white hover:text-current focus-visible:outline-none',
          inputSize === 'large'
            ? 'h-[50px]'
            : inputSize === 'small'
              ? 'h-10'
              : 'h-11',
          error && 'border-destructive',
          className
        )}
      />

      {error && <p className='text-destructive mt-1 text-xs'>{error}</p>}
    </div>
  )
}

export default BaseTimePicker
