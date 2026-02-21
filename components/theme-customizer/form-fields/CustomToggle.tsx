import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { BaseToggleBarProps } from './types'

export function BaseToggleBar({
  selectedValue,
  onChange,
  statuses,
  className,
}: BaseToggleBarProps) {
  return (
    <div className='w-full overflow-x-auto'>
      <ToggleGroup
        type='single'
        value={selectedValue}
        onValueChange={(val) => val && onChange(val)}
        className={`bg-muted rounded-md p-1.5 shadow-sm ${className}`}
      >
        {statuses?.map((status) => (
          <ToggleGroupItem
            key={status.value}
            value={status.value}
            className='text-muted-foreground data-[state=on]:text-generic-primary data-[state=on]:border-generic-primary/70 data-[state=on]:bg-sidebar min-w-[140px] flex-1 shrink-0 rounded-md border border-transparent px-3 py-2 text-center text-sm font-normal data-[state=on]:font-medium data-[state=on]:shadow-sm'
          >
            {status.title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
