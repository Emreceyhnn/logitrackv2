import { ReactNode, useState, useMemo, useCallback, useEffect, memo } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocalizedPath } from "@/app/lib/language/navigation";

export type SidebarItem = {
  title: string;
  icon: ReactNode;
  subTitles?: { title: string; href: string }[];
  href?: string;
};

export type Params = {
  items: SidebarItem[];
  lang: string;
};

export const SidebarList = memo(function SidebarList(params: Params) {
  const { items, lang } = params;

  /* --------------------------------- states --------------------------------- */
  const [openKey, setOpenKey] = useState<string | null>(null);
  const pathname = usePathname();
  const theme = useTheme();

  /* -------------------------------- memoized values -------------------------- */
  const getFullLocalizedPath = useCallback((path: string) => {
    const localizedPath = getLocalizedPath(path, lang);
    return `/${lang}${localizedPath}`;
  }, [lang]);

  const isActive = useCallback((href?: string) => {
    if (!href) return false;
    const fullPath = getFullLocalizedPath(href);
    return pathname === fullPath;
  }, [pathname, getFullLocalizedPath]);

  /* --------------------------------- effects --------------------------------- */
  // Auto-expand sidebar section based on current path
  useEffect(() => {
    items.forEach((item) => {
      const hasActiveChild = item.subTitles?.some((sub) => isActive(sub.href));
      if (hasActiveChild || isActive(item.href)) {
        setOpenKey(item.title);
      }
    });
  }, [pathname, items, isActive]);

  /* --------------------------------- handlers --------------------------------- */
  const handleToggle = useCallback((title: string, e?: React.MouseEvent) => {
    // If it's a toggle click on the arrow, prevent default if needed
    // But here we want it to toggle regardless
    setOpenKey((prev) => (prev === title ? null : title));
  }, []);

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
          isActive(item.href) ||
          item.subTitles?.some((sub) => isActive(sub.href));

        // High-performance navigation props
        const buttonProps = item.href 
          ? { 
              component: Link, 
              href: getFullLocalizedPath(item.href),
              prefetch: true,
            } 
          : { 
              onClick: () => handleToggle(item.title) 
            };

        return (
          <div key={item.title} style={{ width: "100%" }}>
            <ListItemButton
              {...buttonProps}
              selected={activeItem}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                mx: 1,
                width: "calc(100% - 16px)",
                transition: "all 0.2s ease-in-out",
                bgcolor: activeItem
                  ? theme.palette.primary._alpha.main_10
                  : "transparent",
                color: activeItem
                  ? theme.palette.primary.main
                  : "text.secondary",
                "&.Mui-selected": {
                  bgcolor: theme.palette.primary._alpha.main_10,
                  "&:hover": {
                    bgcolor: theme.palette.primary._alpha.main_15,
                  },
                },
                "&:hover": {
                  bgcolor: theme.palette.primary._alpha.main_08,
                  color: theme.palette.primary.main,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
                "&:active": {
                  transform: "scale(0.98)",
                  bgcolor: theme.palette.primary._alpha.main_15,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: activeItem ? theme.palette.primary.main : "inherit",
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: activeItem ? 700 : 500,
                  fontSize: 14,
                  letterSpacing: "0.01em",
                }}
              />

              {hasChildren && (
                <ExpandMoreIcon
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggle(item.title);
                  }}
                  sx={{
                    fontSize: 18,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: 0.7,
                    zIndex: 2, // Ensure it's clickable over the link
                    "&:hover": {
                      opacity: 1,
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              )}
            </ListItemButton>

            {hasChildren && (
              <Collapse in={isOpen} timeout={300} unmountOnExit>
                <List disablePadding sx={{ width: "100%", mt: 0.5 }}>
                  {item?.subTitles?.map((sub) => {
                    const subActive = isActive(sub.href);
                    return (
                      <ListItemButton
                        key={sub.title}
                        component={Link}
                        href={getFullLocalizedPath(sub.href)}
                        selected={subActive}
                        sx={{
                          pl: 7,
                          py: 0.8,
                          borderRadius: "6px",
                          mx: 1.5,
                          width: "calc(100% - 24px)",
                          transition: "all 0.2s",
                          color: subActive
                            ? theme.palette.primary.main
                            : "text.secondary",
                          bgcolor: subActive
                            ? theme.palette.primary._alpha.main_08
                            : "transparent",
                          "&.Mui-selected": {
                            bgcolor: theme.palette.primary._alpha.main_08,
                            "&:hover": {
                              bgcolor: theme.palette.primary._alpha.main_12,
                            },
                          },
                          "&:hover": {
                            bgcolor: theme.palette.primary._alpha.main_05,
                            color: theme.palette.primary.main,
                          },
                          "&:active": {
                            transform: "scale(0.97)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={sub.title}
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
});
