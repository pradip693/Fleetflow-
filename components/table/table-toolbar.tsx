import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useDebounce from "@/hooks/use-debounce";

export type FilterType = "search" | "select" | "date"; // etc

export interface Option {
  label: string;
  value: string;
}

export interface FilterConfig {
  type: FilterType;
  key: string;
  placeholder?: string;
  value?: string;
  options?: Option[];
  onChange?: (value: string | null) => void;
}

interface DataTableToolbarProps {
  filters?: FilterConfig[];
  className?: string;
}

export function DataTableToolbarCompact({
  filters = [],
  className = "",
}: Readonly<DataTableToolbarProps>) {
  const searchFilter = filters.find((f) => f.type === "search");
  const [search, setSearch] = useState(searchFilter?.value ?? "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (searchFilter?.onChange) {
      searchFilter.onChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-1 items-center space-x-2">
        {filters.map((filter) => {
          if (filter.type === "search") {
            return (
              <Input
                key={filter.key}
                type="search"
                placeholder={filter.placeholder ?? "Search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[150px] lg:w-[350px]"
              />
            );
          }

          if (filter.type === "select") {
            return (
              <Select
                key={filter.key}
                value={filter.value}
                onValueChange={filter.onChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
