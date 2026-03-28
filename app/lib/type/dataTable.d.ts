import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

export interface DataTableColumn<TRow> {
  /** Unique identifier for this column — used as React key */
  key: string;
  /** Header label shown in the <TableHead> */
  label: string;
  align?: "left" | "center" | "right";
  /** Optional fixed width (number = px, string = e.g. "10%") */
  width?: number | string;
  /** Cell renderer — receives the full row object, returns any React node */
  render: (row: TRow) => ReactNode;
}

// ---------------------------------------------------------------------------
// Toolbar / filter definitions
// ---------------------------------------------------------------------------

export interface FilterOption {
  label: string;
  value: string;
}

export interface DataTableFilter {
  /** Field key — must match the key used in `activeFilters` */
  key: string;
  label: string;
  options: FilterOption[];
  /** Allow multiple selections (default: true) */
  multiple?: boolean;
}

// ---------------------------------------------------------------------------
// Row actions (MoreVert menu items)
// ---------------------------------------------------------------------------

export interface DataTableRowAction<TRow> {
  label: string;
  icon: ReactNode;
  onClick: (row: TRow) => void;
  /** Controls text/icon color in the menu item */
  color?: "default" | "error" | "warning";
  /** Optional callback to hide the action for a specific row */
  hidden?: (row: TRow) => boolean;
}

// ---------------------------------------------------------------------------
// Main component props
// ---------------------------------------------------------------------------

export interface DataTableProps<TRow extends { id: string }> {
  rows: TRow[];
  columns: DataTableColumn<TRow>[];

  // Loading / empty
  loading?: boolean;
  emptyMessage?: string;

  // Search
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  // Filters (domain-specific multi-select dropdowns rendered in the toolbar)
  filters?: DataTableFilter[];
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (key: string, values: string[]) => void;

  // Row actions rendered as a MoreVert context menu in the last column
  rowActions?: DataTableRowAction<TRow>[];
}
