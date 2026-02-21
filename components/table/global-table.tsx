import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface BaseFilter {
  key: string;
  label: string;
}

export interface SearchFilter extends BaseFilter {
  type: "search";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export interface SelectFilter extends BaseFilter {
  type: "select";
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export interface DateRangeFilter extends BaseFilter {
  type: "dateRange";
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  placeholder?: string;
}

export interface MultiSelectFilter extends BaseFilter {
  type: "multiSelect";
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export type FilterConfig =
  | SearchFilter
  | SelectFilter
  | DateRangeFilter
  | MultiSelectFilter;

interface GlobalTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  filters?: FilterConfig[];
  isPaginationEnabled?: boolean;
  loading?: boolean;
}

export function GlobalTable<TData>({
  data,
  columns,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  filters,
  isPaginationEnabled = true,
  loading = false,
}: Readonly<GlobalTableProps<TData>>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const pagination: PaginationState = {
    pageIndex: currentPage > 0 ? currentPage - 1 : 0,
    pageSize,
  };

  const pageCount = pageSize > 0 ? Math.ceil((totalCount ?? 0) / pageSize) : 0;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: pageCount,
  });

  return (
    <div className="border-border/60 bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md">
      {/* Filters Header */}
      {filters && filters.length > 0 && (
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            {filters.map((filter) => {
              if (filter.type === "search") {
                return (
                  <div key={filter.key} className="relative group">
                    <Input
                      placeholder={
                        filter.placeholder || `Search ${filter.label}...`
                      }
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="h-9 w-64 pr-8"
                    />
                    {filter.value && (
                      <button
                        type="button"
                        onClick={() => filter.onChange("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-5 rounded-md hover:bg-muted transition-all z-10"
                        aria-label="Clear search"
                      >
                        <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                );
              }
              if (filter.type === "select") {
                return (
                  <div key={filter.key} className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {filter.label}:
                    </span>
                    <div className="relative group">
                      <Select
                        value={filter.value || "all"}
                        onValueChange={(val) => filter.onChange(val || "")}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-9 w-45 transition-all",
                            filter.value &&
                              filter.value !== "all" &&
                              "group-hover:[&_svg]:opacity-0",
                          )}
                        >
                          <SelectValue placeholder={`Select ${filter.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {filter.value && filter.value !== "all" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            filter.onChange("all");
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                          aria-label="Clear selection"
                        >
                          <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
              if (filter.type === "dateRange") {
                return (
                  <div key={filter.key} className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {filter.label}:
                    </span>
                    <Popover>
                      <div className="relative group">
                        <PopoverTrigger
                          className={cn(
                            "h-9 w-60 justify-start text-left font-normal transition-all border rounded-md px-3 inline-flex items-center",
                            !filter.value && "text-muted-foreground",
                            filter.value &&
                              "group-hover:[&_svg.calendar-icon]:opacity-0",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 calendar-icon" />
                          {filter.value?.from ? (
                            filter.value.to ? (
                              <>
                                {format(filter.value.from, "LLL dd, y")} -{" "}
                                {format(filter.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(filter.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>
                              {filter.placeholder || "Pick a date range"}
                            </span>
                          )}
                        </PopoverTrigger>
                        {filter.value && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              filter.onChange(undefined);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                            aria-label="Clear date range"
                          >
                            <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                      </div>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={filter.value?.from}
                          selected={filter.value}
                          onSelect={filter.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }
              if (filter.type === "multiSelect") {
                return (
                  <div key={filter.key} className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {filter.label}:
                    </span>
                    <Popover>
                      <div className="relative group">
                        <PopoverTrigger
                          className={cn(
                            "h-9 w-55 justify-start text-left font-normal transition-all border rounded-md px-3 inline-flex items-center",
                            filter.value.length === 0 &&
                              "text-muted-foreground",
                            filter.value.length > 0 &&
                              "group-hover:[&>span]:opacity-0",
                          )}
                        >
                          {filter.value.length > 0 ? (
                            <span className="truncate">
                              {filter.value.length} selected
                            </span>
                          ) : (
                            <span>
                              {filter.placeholder || `Select ${filter.label}`}
                            </span>
                          )}
                        </PopoverTrigger>
                        {filter.value.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              filter.onChange([]);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                            aria-label="Clear selection"
                          >
                            <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                      </div>
                      <PopoverContent className="w-55 p-3" align="start">
                        <div className="space-y-2 max-h-50 overflow-auto">
                          {filter.options.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1.5 rounded-md transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={filter.value.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    filter.onChange([
                                      ...filter.value,
                                      option.value,
                                    ]);
                                  } else {
                                    filter.onChange(
                                      filter.value.filter(
                                        (v) => v !== option.value,
                                      ),
                                    );
                                  }
                                }}
                                className="rounded border-muted-foreground"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }
              return null;
            })}

            {filters.some((f) => {
              if (f.type === "search") return f.value && f.value !== "";
              if (f.type === "select") return f.value && f.value !== "all";
              if (f.type === "dateRange") return f.value !== undefined;
              if (f.type === "multiSelect") return f.value.length > 0;
              return false;
            }) && (
              <Button
                variant="ghost"
                onClick={() => {
                  filters.forEach((f) => {
                    if (f.type === "search") f.onChange("");
                    else if (f.type === "select") f.onChange("all");
                    else if (f.type === "dateRange") f.onChange(undefined);
                    else if (f.type === "multiSelect") f.onChange([]);
                  });
                }}
                className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
              >
                Clear All Filters
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Table Area */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border border-b hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "text-primary h-12 px-4 font-semibold whitespace-nowrap",
                      (header.column.columnDef.meta as any)?.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="border-border/40 border-b"
                >
                  {columns.map((_column, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${colIndex}`}
                      className="px-4 py-3"
                    >
                      <Skeleton
                        className={cn(
                          "h-5 rounded-md",
                          colIndex === 0
                            ? "w-[40%]"
                            : colIndex === columns.length - 1
                            ? "w-[20%]"
                            : "w-[80%]",
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border/40 hover:bg-primary/2 data-[state=selected]:bg-primary/8 border-b transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-foreground/80 px-4 py-3 text-sm",
                        (cell.column.columnDef.meta as any)?.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {isPaginationEnabled && (totalCount ?? 0) > 0 && (
        <div className="border-border bg-card flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
                disabled={loading}
              >
                <SelectTrigger className="bg-background h-8 w-17.5">
                  <SelectValue placeholder={String(pageSize)} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden sm:block">Total {totalCount}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1 pr-3 pl-2.5"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <div className="text-muted-foreground flex min-w-25 items-center justify-center text-sm font-medium">
              Page <span className="text-foreground mx-1">{currentPage}</span>{" "}
              of <span className="text-foreground mx-1">{pageCount}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1 pr-2.5 pl-3"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= pageCount || loading}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={() => onPageChange(pageCount)}
              disabled={currentPage >= pageCount || loading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
