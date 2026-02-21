import type { ElementType, ReactNode, JSX } from 'react'
import type { UrlObject } from 'url'

type Url = string | UrlObject

type TypographyVariant = 'heading1' | 'heading2' | 'body' | 'caption' | 'link'
export type ThemeVariant = 'default' | 'rounded' | 'shadow' | 'glass'

interface TitleTextProps {
  children: ReactNode
  className?: string
}

export interface TypographyProps extends TitleTextProps {
  variant?: TypographyVariant
  as?: ElementType
  onClick?: () => void
}

export interface CustomBaseButtonProps {
  content: React.ReactNode
  className?: string
  asChild?: boolean
  path?: Url
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  icon?: React.ReactNode
  uiVariant?: ThemeVariant
  iconPosition?: 'left' | 'right'
}

export interface FormattedDateCellProps {
  value: string | Date
  fallback?: string
}

export interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  onCancel: () => void
  onAction: () => void
  actionLabel?: string
  cancelLabel?: string
  loading?: boolean
}

export interface UsersInfoType {
  id: string
  full_name: string
  phone_number: string
  email: string
  profile_image?: string | null
  role?: {
    id: string
    name: string
  }
}

export type UsersInfoDropdownProps = {
  users: Array<UsersInfoType>
  type?: string
  showRole?: boolean
  showPhone?: boolean
}

export interface User {
  id: string
  name: string
  role: string
  avatar: string
  order: number
}
export interface SortableUserItemProps {
  user: User
  index: number
  onOrderChange: (id: string, newOrder: number) => void
}

export interface BasicDetailsCard {
  children: React.ReactNode
  className?: string
}

export type LogoLoaderProps = Readonly<{
  className?: string
  fullScreen?: boolean
}>

export interface RenderIfArrayProps<T> {
  readonly data: readonly T[] | undefined | null
  readonly children: ReactNode
  readonly fallback?: ReactNode
}

export interface NoDataProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export interface DateRangeFilterSectionProps {
  startDate: Date | undefined
  setStartDate: (date: Date | undefined) => void
  endDate: Date | undefined
  setEndDate: (date: Date | undefined) => void
  onFilterChange: (key: string, value: string[]) => void
  onClearAllFilters: () => void
}

export interface BaseSearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  showLabel?: boolean
  wrapperClassName?: string
  labelClassName?: string
  inputSize?: 'large' | 'medium' | 'small'
  required?: boolean
  value?: string
  onChange?: (e: string) => void
}

export interface BaseCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>
  className?: string
}

export interface UserOption {
  id: string
  name: string
  phone?: string
}

export interface UserSelectDropdownProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  options: UserOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  dropDownClassName?: string
  required?: boolean
  hasError?: boolean
  onAddCustomer?: () => void
}

export interface GlassCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  maxWidth?: string
}