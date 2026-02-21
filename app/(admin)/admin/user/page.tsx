"use client";

import Link from "next/link";

import { AppButton } from "@/components/shared/app-button";
import { AppTableContainer } from "@/components/shared/app-table-container";
import { UsersTable } from "@/features/users/components/users-table";

export default function UsersPage() {
  return (
    <AppTableContainer
      title="Users"
      description="Manage your application users."
      action={
        <AppButton asChild>
          <Link href="/admin/user/create-user">Add User</Link>
        </AppButton>
      }
    >
      <UsersTable />
    </AppTableContainer>
  );
}
