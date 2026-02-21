"use client";

import { AppButton } from "@/components/shared/app-button";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { UserDetail } from "../../types/user.types";

interface GetUserColumnsProps {
  onDelete: (id: string, name: string) => void;
}

export const getUserColumns = ({
  onDelete,
}: GetUserColumnsProps): ColumnDef<UserDetail>[] => [
  {
    header: "Name",
    cell: ({ row }) => {
      const translation = row.original.translations.find(
        (t) => t.language_code === "en",
      );
      return (
        <div className="font-medium text-foreground">
          {translation?.name || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-3 py-0.5 capitalize",
            category === "general"
              ? "border-blue-500/20 bg-blue-400/10 text-blue-500"
              : "border-purple-500/20 bg-purple-500/10 text-purple-500",
          )}
        >
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const name =
        row.original.translations.find((t) => t.language_code === "en")?.name ||
        "User";

      return (
        <div className="flex items-center gap-2">
          <AppButton variant="ghost" size="icon" className="size-8" asChild>
            <Link href={`/admin/user/${row.original.reciter_id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </AppButton>
          <DeleteConfirmDialog
            onConfirm={() => onDelete(row.original.reciter_id, name)}
            title="Delete User"
            description="Are you sure you want to delete this user? This action cannot be undone."
            requireConfirmationText={`Delete ${name}`}
          />
        </div>
      );
    },
  },
];
