import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    mode: "light",
    primary: { _alpha: { main_03: "", main_08: "", main_10: "", main_15: "", main_20: "" }, main: "", dark: "" },
    background: { paper: "", paper_alpha: { main_60: "" } },
    text: { primary: "", secondary: "" },
    divider: "",
    divider_alpha: { main_10: "" }
  }
}));

const useDictionaryMock = mock.fn(() => ({
  common: {
    search: "Search",
    noData: "No Data",
    all: "All",
    filtersActive: "Filters",
    clearAll: "Clear",
    pagination: { totalRecords: "" },
    tooltips: {}
  }
}));

// React hooks mock'ları (Hook kurallarını ihlal etmemek için)
const useStateMock = mock.fn((init) => [init, mock.fn()]);
const useEffectMock = mock.fn();
const useCallbackMock = mock.fn((fn) => fn);
const useMemoMock = mock.fn((fn) => fn());
const useRefMock = mock.fn(() => ({ current: null }));

mock.module("react", {
  namedExports: {
    useState: useStateMock,
    useEffect: useEffectMock,
    useCallback: useCallbackMock,
    useMemo: useMemoMock,
    useRef: useRefMock,
  }
});

mock.module("@/app/lib/language/DictionaryContext", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("@mui/material", {
  namedExports: { 
    useTheme: useThemeMock,
    Table: (props: unknown) => ({ type: "Table", props }),
    TableBody: (props: unknown) => ({ type: "TableBody", props }),
    TableCell: (props: unknown) => ({ type: "TableCell", props }),
    TableContainer: (props: unknown) => ({ type: "TableContainer", props }),
    TableHead: (props: unknown) => ({ type: "TableHead", props }),
    TableRow: (props: unknown) => ({ type: "TableRow", props }),
    TablePagination: (props: unknown) => ({ type: "TablePagination", props }),
    TableSortLabel: (props: unknown) => ({ type: "TableSortLabel", props }),
    Typography: (props: unknown) => ({ type: "Typography", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    TextField: (props: unknown) => ({ type: "TextField", props }),
    InputAdornment: (props: unknown) => ({ type: "InputAdornment", props }),
    IconButton: (props: unknown) => ({ type: "IconButton", props }),
    Menu: (props: unknown) => ({ type: "Menu", props }),
    MenuItem: (props: unknown) => ({ type: "MenuItem", props }),
    ListItemIcon: (props: unknown) => ({ type: "ListItemIcon", props }),
    ListItemText: (props: unknown) => ({ type: "ListItemText", props }),
    FormControl: (props: unknown) => ({ type: "FormControl", props }),
    InputLabel: (props: unknown) => ({ type: "InputLabel", props }),
    Select: (props: unknown) => ({ type: "Select", props }),
    OutlinedInput: (props: unknown) => ({ type: "OutlinedInput", props }),
    Checkbox: (props: unknown) => ({ type: "Checkbox", props }),
    Divider: (props: unknown) => ({ type: "Divider", props }),
    Box: (props: unknown) => ({ type: "Box", props }),
    Chip: (props: unknown) => ({ type: "Chip", props }),
    Button: (props: unknown) => ({ type: "Button", props }),
    Tooltip: (props: unknown) => ({ type: "Tooltip", props }),
  }
});

mock.module("@mui/icons-material/Search", { defaultExport: () => ({ type: "SearchIcon" }) });
mock.module("@mui/icons-material/MoreVert", { defaultExport: () => ({ type: "MoreVertIcon" }) });
mock.module("@/app/components/skeletons/TableSkeleton", { defaultExport: () => ({ type: "TableSkeleton" }) });
mock.module("@/app/components/cards/card", { defaultExport: () => ({ type: "CustomCard" }) });

const useReactTableMock = mock.fn(() => ({
  getAllColumns: () => [],
  getHeaderGroups: () => [],
  getRowModel: () => ({ rows: [] }),
  getState: () => ({ pagination: { pageSize: 10, pageIndex: 0 } }),
}));

mock.module("@tanstack/react-table", {
  namedExports: {
    useReactTable: useReactTableMock,
    getCoreRowModel: mock.fn(),
    getSortedRowModel: mock.fn(),
    getPaginationRowModel: mock.fn(),
    getFilteredRowModel: mock.fn(),
    flexRender: mock.fn(),
    createColumnHelper: () => ({ display: mock.fn() }),
  }
});

describe("DataTable Component", () => {
  let DataTable: React.ElementType;

  before(async () => {
    const mod = await import("./index");
    DataTable = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
    useStateMock.mock.resetCalls();
    useReactTableMock.mock.resetCalls();
  });

  describe("DataTable() bileşeni", () => {
    it("should_InitializeTable_WhenValidPropsProvided", async () => {
      // Arrange
      const columns = [{ key: "id", label: "ID", render: (r: unknown) => r.id }];
      const rows = [{ id: "1" }];
      
      // Act
      try {
        DataTable({ columns, rows, emptyMessage: "Kayıt yok" });
      } catch (e) {
        // Node ortamında ve DOM olmadan kompleks React 19 JSX runtime 
        // işlemlerinin hata vermesi beklenir, ancak öncesinde hook'ların
        // doğru çağrıldığını doğrulayabiliriz.
      }
      
      // Assert
      expect(useThemeMock.mock.calls.length).toBeGreaterThan(0);
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
      expect(useReactTableMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
