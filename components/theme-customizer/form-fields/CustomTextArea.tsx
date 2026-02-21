import clsx from 'clsx'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import type { BaseTextAreaProps } from './types'

const BaseTextArea: React.FC<BaseTextAreaProps> = ({
  label,
  showLabel = false,
  className,
  wrapperClassName,
  labelClassName,
  register,
  field,
  disabled,
  required = false,
  maxLength = 150,
  showTextLength = false,
  ...props
}) => {
  const value = field?.value ?? ''

  return (
    <div className={clsx('space-y-1', wrapperClassName)}>
      {label && showLabel && (
        <Label
          className={clsx(
            'text-primary-grey tracking-custom-lg leading-custom-lg text-sm font-medium',
            labelClassName
          )}
        >
          {required && <span className='text-destructive'>*</span>}
          {label}
        </Label>
      )}

      <div className='relative'>
        <Textarea
          {...props}
          {...register}
          {...field}
          disabled={disabled}
          maxLength={showTextLength ? maxLength : undefined}
          rows={4}
          className={clsx(
            'shadow-custom-light-sm focus-visible:shadow-custom-light-sm w-full resize-none text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2',
            'outline-none placeholder:text-sm focus-visible:outline-none',
            'wrap-break-word! whitespace-pre-wrap!',
            className
          )}
        />

        {showTextLength && (
          <span className='text-muted-foreground pointer-events-none absolute right-0 bottom-2 pr-3 text-xs tabular-nums'>
            {String(value).length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

export default BaseTextArea
