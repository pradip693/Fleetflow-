import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  additionalActions?: React.ReactNode;
}

/**
 * **TableActions**
 *
 * A standardized dropdown component for row-level actions in the GlobalTable.
 */
export function TableActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  additionalActions,
}: Readonly<TableActionsProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Edit2 className="mr-2 h-4 w-4" />
            <span>{editLabel}</span>
          </DropdownMenuItem>
        )}

        {additionalActions}

        {onDelete && (
          <>
            {(onEdit || additionalActions) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{deleteLabel}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
