import { CheckboxRootProps } from '@base-ui/react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { ControllerRenderProps, FieldValues, UseFormRegisterReturn } from 'react-hook-form'

export type InputSize = 'small' | 'large' | 'medium'
export type ThemeVariant = 'default' | 'rounded' | 'shadow' | 'glass'

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name?:string
  showLabel?: boolean
  loading?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  register?: UseFormRegisterReturn
  field?: ControllerRenderProps<FieldValues, string>
  required?: boolean
  inputSize?: 'default' | 'small' | 'large'
  showTextLength?: boolean
  uiVariant?:ThemeVariant
}

export interface BaseTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  showLabel?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  register?: UseFormRegisterReturn
  field?: ControllerRenderProps<FieldValues, string>
  disabled?: boolean
  inputSize?: 'small' | 'medium' | 'large'
  required?: boolean
  maxLength?: number
  showTextLength?: boolean
  uiVariant?:ThemeVariant
}

export interface PasswordInputProps extends Omit<BaseInputProps, 'type'> {
  showPassword?: boolean
  onTogglePassword?: (show: boolean) => void
}

export interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  showLabel?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  register?: UseFormRegisterReturn
  field?: ControllerRenderProps<FieldValues, string>
  disabled?: boolean
  required?: boolean
  error?: string
  uiVariant?:ThemeVariant
  helperText?: string
}

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  showLabel?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  register?: UseFormRegisterReturn
  field?: ControllerRenderProps<FieldValues, string>
  disabled?: boolean
  inputSize?: InputSize
  required?: boolean
  maxLength?: number
  showTextLength?: boolean
  error?: string
  helperText?: string
  uiVariant?:ThemeVariant
  rows?: number
}

export interface SelectFieldProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  showLabel?: boolean
  className?: string
  wrapperClassName?: string
  labelClassName?: string
  register?: UseFormRegisterReturn
  field?: ControllerRenderProps<FieldValues, string>
  disabled?: boolean
  required?: boolean
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
  uiVariant?:ThemeVariant
}

type FormFieldProps = Pick<ControllerRenderProps, 'value' | 'onChange' | 'ref'>
export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface BaseCheckboxProps
  extends Omit<CheckboxRootProps, 'checked' | 'onCheckedChange'> {
  label?: string
  showLabel?: boolean
  wrapperClassName?: string
  labelClassName?: string
  register?: UseFormRegisterReturn
  field?: FormFieldProps
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: CheckboxSize
  colorType?: 'primary' | 'default'
  inputLabel?: string
  required?: boolean
  uiVariant?:ThemeVariant
}

interface BaseRadioOption {
  label: string
  value: string
}

export interface CustomRadioGroupProps {
  label?: string | React.ReactNode
  options: Array<BaseRadioOption>
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  wrapperClassName?: string
  labelClassName?: string
  className?: string
  colorType?: string
  required?: boolean
  uiVariant?:ThemeVariant
}

export interface FileUploadProps {
  onSubmit?: (file: File | null) => void
  disabled?: boolean
  accept?: string
}

export type Option = {
  label: string
  value: string
  disabled?: boolean
}

export interface BaseSelectProps {
  label?: string
  value?: string | string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void
  options:
    | Option[]
    | { label: string | React.ReactNode; value: string; disabled?: boolean }[]
  disabled?: boolean
  disabledOptions?: Set<string>
  placeholder?: string
  className?: string
  drodpDownClassName?: string
  wrapperClassName?: string
  labelClassName?: string
  required?: boolean
  multiple?: boolean
  searchable?: boolean
  maxSelectedDisplay?: number
  renderValue?: object
  hasError?: boolean
  uiVariant?:ThemeVariant
}

export interface BaseToggleBarProps {
  selectedValue: string
  onChange: (value: string) => void
  statuses: Array<ToggleItems>
  className?: string
}

export type ToggleItems = {
  title: string
  value: string
}

export interface DateRangeFilterSectionProps {
  startDate: Date | undefined
  setStartDate: (date: Date | undefined) => void
  endDate: Date | undefined
  setEndDate: (date: Date | undefined) => void
  onFilterChange: (key: string, value: string[]) => void
  onClearAllFilters: () => void
}

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  showLabel?: boolean
  wrapperClassName?: string
  labelClassName?: string
  inputSize?: 'large' | 'medium' | 'small'
  required?: boolean
  value?: string
  uiVariant?:ThemeVariant
  onChange?: (e: string) => void
}

export type LabelProps = {
    label: string
    labelClassName?: string
    required?: boolean
}