import { ReactNode, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter, usePathname } from "next/navigation";

export type SidebarItem = {
  title: string;
  icon: ReactNode;
  subTitles?: string[];
};

export type Params = {
  items: SidebarItem[];
};

export function SidebarList(params: Params) {
  const { items } = params;

  /* --------------------------------- states --------------------------------- */
  const [openKey, setOpenKey] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  /* --------------------------------- handlers --------------------------------- */
  const handleToggle = (title: string) => {
    setOpenKey((prev) => (prev === title ? null : title));
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const getRoute = (title: string) => {
    const routes: Record<string, string> = {
      Overview: "/overview",
      Vehicles: "/vehicle",
      Drivers: "/drivers",
      Routes: "/routes",
      Shipments: "/shipments",
      Management: "/management",
      Warehouses: "/warehouses",
      Inventory: "/inventory",
      Customers: "/customers",
      Reports: "/reports",
      Analytics: "/analytics",
      Users: "/users",
      Roles: "/roles",
      Settings: "/settings",
      Company: "/company",
    };
    return routes[title] || "#";
  };

  const isActive = (title: string) => {
    const route = getRoute(title);
    return pathname === route;
  };

  return (
    <List
      disablePadding
      sx={{
        display: "flex",
        gap: 0.5,
        flexDirection: "column",
        padding: 0,
        width: "100%",
      }}
    >
      {items.map((item) => {
        const hasChildren = Boolean(item.subTitles?.length);
        const isOpen = openKey === item.title;
        const activeItem =
          isActive(item.title) || item.subTitles?.some((sub) => isActive(sub));

        return (
          <div key={item.title} style={{ width: "100%" }}>
            <ListItemButton
              onClick={() =>
                hasChildren
                  ? handleToggle(item.title)
                  : handleNavigate(getRoute(item.title))
              }
              sx={{
                px: 3,
                py: 1,
                bgcolor: activeItem
                  ? alpha(theme.palette.primary.main, 0.08)
                  : "transparent",
                color: activeItem
                  ? theme.palette.primary.main
                  : "text.secondary",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
                borderRight: activeItem
                  ? `3px solid ${theme.palette.primary.main}`
                  : "none",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: activeItem ? theme.palette.primary.main : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: activeItem ? 700 : 500,
                  fontSize: 14,
                }}
              />

              {hasChildren && (
                <ExpandMoreIcon
                  sx={{
                    fontSize: 18,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              )}
            </ListItemButton>

            {hasChildren && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ width: "100%" }}>
                  {item?.subTitles?.map((sub) => {
                    const subActive = isActive(sub);
                    return (
                      <ListItemButton
                        key={sub}
                        onClick={() => handleNavigate(getRoute(sub))}
                        sx={{
                          pl: 7,
                          py: 0.75,
                          color: subActive
                            ? theme.palette.primary.main
                            : "text.secondary",
                          bgcolor: subActive
                            ? alpha(theme.palette.primary.main, 0.05)
                            : "transparent",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <ListItemText
                          primary={sub}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: subActive ? 700 : 500,
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </div>
        );
      })}
    </List>
  );
}
