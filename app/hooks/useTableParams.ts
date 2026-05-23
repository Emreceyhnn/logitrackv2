"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface TableParamsOptions {
  defaultPageSize?: number;
  defaultSortField?: string;
  defaultSortOrder?: "asc" | "desc";
}

export function useTableParams(options?: TableParamsOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse values from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || options?.defaultPageSize || 10;
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortBy") || options?.defaultSortField || "";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || options?.defaultSortOrder || "asc";

  // Generic helper for multi-select arrays
  const getArrayFilter = useCallback((key: string): string[] => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  }, [searchParams]);

  // Generic helper for single-select filters
  const getFilter = useCallback((key: string): string | undefined => {
    return searchParams.get(key) || undefined;
  }, [searchParams]);

  // Update a specific parameter in the URL
  const updateParams = useCallback((updates: Record<string, string | string[] | number | undefined | null>, replace = true) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, String(value));
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    if (replace) {
      router.replace(newUrl, { scroll: false });
    } else {
      router.push(newUrl, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  // Specific setters
  const setPage = useCallback((newPage: number) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  const setPageSize = useCallback((newPageSize: number) => {
    updateParams({ pageSize: newPageSize, page: 1 });
  }, [updateParams]);

  const setSearch = useCallback((newSearch: string) => {
    updateParams({ search: newSearch, page: 1 }, false); // push instead of replace for search
  }, [updateParams]);

  const setSort = useCallback((field: string, order?: "asc" | "desc") => {
    let newOrder = order;
    if (!newOrder) {
      // Toggle logic
      if (sortField === field) {
        newOrder = sortOrder === "asc" ? "desc" : "asc";
      } else {
        newOrder = "asc";
      }
    }
    updateParams({ sortBy: field, sortOrder: newOrder, page: 1 });
  }, [sortField, sortOrder, updateParams]);

  const setFilter = useCallback((key: string, value: string | string[] | undefined) => {
    updateParams({ [key]: value, page: 1 }, false);
  }, [updateParams]);

  const clearAllFilters = useCallback((keysToClear: string[]) => {
    const updates: Record<string, undefined> = {};
    keysToClear.forEach(key => { updates[key] = undefined; });
    // Keep page, pageSize, sortBy, sortOrder
    updateParams({ ...updates, search: undefined, page: 1 }, false);
  }, [updateParams]);

  return {
    // Current state
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
    getFilter,
    getArrayFilter,
    
    // Setters
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setFilter,
    clearAllFilters,
    updateParams,
  };
}
