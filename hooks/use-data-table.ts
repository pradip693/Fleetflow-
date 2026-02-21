"use client";

import { useState } from "react";

export interface BaseParams {
  limit: number;
  page: number;
  search?: string;
  role?: string;
  status?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export function useDataTable() {
  const [listParams, setListParams] = useState<BaseParams>({
    limit: 10,
    page: 1,
    search: "",
    role: undefined,
    status: undefined,
  });

  const handleSearch = (search?: string) => {
    setListParams(prev => ({ ...prev, search: search ?? "", page: 1 }));
  };

  const handleSelectChange = (key: keyof BaseParams, value?: string) => {
    setListParams(prev => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setListParams(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setListParams(prev => ({ ...prev, limit: newSize, page: 1 }));
  };

  const apiParams = listParams;

  return {
    listParams,
    apiParams,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSelectChange,
  };
}
