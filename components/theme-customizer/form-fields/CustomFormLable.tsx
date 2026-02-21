'use client'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { LabelProps } from './types'

function CustomFormLable({
    label,
    labelClassName,
    required = false,
}: LabelProps) {
    return (
        <Label
            className={cn(
                'text-sm font-medium',
                labelClassName
            )}
        >
            {required && <span className='text-destructive -mr-1'>*</span>}
            {label}
        </Label>
    )
}

export default CustomFormLable