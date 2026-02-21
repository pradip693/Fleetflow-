"use client";

import { API_ENDPOINTS } from "@/api/endpoints";
import useFetchDetails from "@/api/hooks/use-fetch-details";
import { UserForm } from "@/features/users/components/user-form";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: userData,
    isLoading,
    error,
  } = useFetchDetails<any>({
    url: API_ENDPOINTS.USERS.BASE,
    id: id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">
          Error Loading User
        </h2>
        <p className="text-muted-foreground">
          The user details could not be retrieved. It may have been deleted or
          the ID is invalid.
        </p>
      </div>
    );
  }

  // Compute initialData directly 
  const initialData = userData
    ? {
        ...userData,
        fullName:
          userData.translations?.find(
            (t: any) => t.language_code === "en",
          )?.name || userData.fullName || "",
      }
    : null;

  return <UserForm mode="edit" initialData={initialData} userId={id} />;
}
