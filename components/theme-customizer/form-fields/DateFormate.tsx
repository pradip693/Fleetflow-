import { customDateTimeformat } from '@/lib/common-function'
import { FormattedDateCellProps } from './types'

export function DateFormate({ value, fallback = '-' }: FormattedDateCellProps) {
  if (!value) return <span>{fallback}</span>
  return <span>{customDateTimeformat(value, 'DD-MM-YY', 'DD-MM-YY')}</span>
}
