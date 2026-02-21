"use client";

// Commented out API integration - using static data instead
// import { API_ENDPOINTS } from "@/api/endpoints";
// import { PaginatedData } from "@/api/hooks/type";
// import useDeleteData from "@/api/hooks/use-delete-data";
// import { useFetchData } from "@/api/hooks/use-fetch-data";
import { FilterConfig, GlobalTable } from "@/components/table/global-table";
import { useDataTable } from "@/hooks/use-data-table";
// import { useQueryClient } from "@tanstack/react-query";
import { UserDetail } from "../types/user.types";
import { getUserColumns } from "./list/user.columns";
import { useState } from "react";

// Dummy static data
const dummyUsers: UserDetail[] = [
  {
    reciter_id: "1",
    category: "general",
    translations: [
      {
        id: "1-en",
        language_code: "en",
        name: "John Doe",
        created_at: "2024-01-15",
      },
    ],
    created_at: "2024-01-15",
  },
  {
    reciter_id: "2",
    category: "premium",
    translations: [
      {
        id: "2-en",
        language_code: "en",
        name: "Jane Smith",
        created_at: "2024-01-16",
      },
    ],
    created_at: "2024-01-16",
  },
  {
    reciter_id: "3",
    category: "general",
    translations: [
      {
        id: "3-en",
        language_code: "en",
        name: "Ahmed Ali",
        created_at: "2024-01-17",
      },
    ],
    created_at: "2024-01-17",
  },
  {
    reciter_id: "4",
    category: "premium",
    translations: [
      {
        id: "4-en",
        language_code: "en",
        name: "Sarah Johnson",
        created_at: "2024-01-18",
      },
    ],
    created_at: "2024-01-18",
  },
  {
    reciter_id: "5",
    category: "general",
    translations: [
      {
        id: "5-en",
        language_code: "en",
        name: "Michael Brown",
        created_at: "2024-01-19",
      },
    ],
    created_at: "2024-01-19",
  },
];

export function UsersTable() {
  const { apiParams, handlePageChange, handlePageSizeChange, handleSearch } =
    useDataTable();

  const [isLoading] = useState(false);

  // Commented out API calls
  // const queryClient = useQueryClient();
  // const { data: paginatedUsers, isLoading } = useFetchData<
  //   PaginatedData<UserDetail>
  // >({
  //   url: API_ENDPOINTS.USERS.BASE,
  //   params: {
  //     ...apiParams,
  //     pagination: "true",
  //   },
  // });

  // const { mutateAsync: deleteUserAsync } = useDeleteData({
  //   url: `${API_ENDPOINTS.USERS.BASE}/`,
  //   mutationOptions: {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.USERS.BASE] });
  //     },
  //   },
  // });

  const handleDelete = async (id: string) => {
    // await deleteUserAsync(id);
    console.log("Delete user:", id);
    alert("Delete functionality disabled - using static data");
  };

  const columns = getUserColumns({ onDelete: handleDelete });

  const filters: FilterConfig[] = [
    {
      key: "search",
      label: "User",
      type: "search",
      placeholder: "Search users...",
      value: apiParams.search ?? "",
      onChange: (val) => handleSearch(val),
    },
  ];

  return (
    <GlobalTable
      data={dummyUsers}
      columns={columns}
      loading={isLoading}
      filters={filters}
      totalCount={dummyUsers.length}
      currentPage={apiParams.page}
      pageSize={apiParams.limit}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
