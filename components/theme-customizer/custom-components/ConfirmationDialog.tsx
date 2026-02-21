'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CustomBaseButton } from './CustomBaseButton'
import type { ConfirmationDialogProps } from './types'

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onCancel,
  onAction,
  actionLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className='space-y-4 px-6 py-4 pt-2'>{children}</div>

        <DialogFooter>
          <CustomBaseButton
            variant='outline'
            onClick={onCancel}
            disabled={loading}
            content={cancelLabel}
          />
          <CustomBaseButton
            content={loading ? 'Loading...' : actionLabel}
            onClick={onAction}
            disabled={loading}
            loading={loading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
