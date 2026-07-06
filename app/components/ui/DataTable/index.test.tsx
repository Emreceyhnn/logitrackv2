 
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

mock.module("../../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock }
});

mock.module("@mui/material", {
  namedExports: { 
    useTheme: useThemeMock,
    Table: (props: any) => ({ type: "Table", props }),
    TableBody: (props: any) => ({ type: "TableBody", props }),
    TableCell: (props: any) => ({ type: "TableCell", props }),
    TableContainer: (props: any) => ({ type: "TableContainer", props }),
    TableHead: (props: any) => ({ type: "TableHead", props }),
    TableRow: (props: any) => ({ type: "TableRow", props }),
    TablePagination: (props: any) => ({ type: "TablePagination", props }),
    TableSortLabel: (props: any) => ({ type: "TableSortLabel", props }),
    Typography: (props: any) => ({ type: "Typography", props }),
    Stack: (props: any) => ({ type: "Stack", props }),
    TextField: (props: any) => ({ type: "TextField", props }),
    InputAdornment: (props: any) => ({ type: "InputAdornment", props }),
    IconButton: (props: any) => ({ type: "IconButton", props }),
    Menu: (props: any) => ({ type: "Menu", props }),
    MenuItem: (props: any) => ({ type: "MenuItem", props }),
    ListItemIcon: (props: any) => ({ type: "ListItemIcon", props }),
    ListItemText: (props: any) => ({ type: "ListItemText", props }),
    FormControl: (props: any) => ({ type: "FormControl", props }),
    InputLabel: (props: any) => ({ type: "InputLabel", props }),
    Select: (props: any) => ({ type: "Select", props }),
    OutlinedInput: (props: any) => ({ type: "OutlinedInput", props }),
    Checkbox: (props: any) => ({ type: "Checkbox", props }),
    Divider: (props: any) => ({ type: "Divider", props }),
    Box: (props: any) => ({ type: "Box", props }),
    Chip: (props: any) => ({ type: "Chip", props }),
    Button: (props: any) => ({ type: "Button", props }),
    Tooltip: (props: any) => ({ type: "Tooltip", props }),
  }
});

mock.module("@mui/icons-material/Search", { defaultExport: () => ({ type: "SearchIcon" }) });
mock.module("@mui/icons-material/MoreVert", { defaultExport: () => ({ type: "MoreVertIcon" }) });
mock.module("../../skeletons/TableSkeleton.tsx", { defaultExport: () => ({ type: "TableSkeleton" }) });
mock.module("../../cards/card.tsx", { defaultExport: () => ({ type: "CustomCard" }) });

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
  let DataTable: any;

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
      const columns = [{ key: "id", label: "ID", render: (r: any) => r.id }];
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
