import { ReactNode, useState } from "react";
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

export function SidebarList(params: Params) {
  const { items, lang } = params;

  /* --------------------------------- states --------------------------------- */
  const [openKey, setOpenKey] = useState<string | null>(null);
  const pathname = usePathname();
  const theme = useTheme();

  /* --------------------------------- handlers --------------------------------- */
  const handleToggle = (title: string) => {
    setOpenKey((prev) => (prev === title ? null : title));
  };

  const getFullLocalizedPath = (path: string) => {
    const localizedPath = getLocalizedPath(path, lang);
    return `/${lang}${localizedPath}`;
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    const fullPath = getFullLocalizedPath(href);
    return pathname === fullPath;
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
          isActive(item.href) ||
          item.subTitles?.some((sub) => isActive(sub.href));

        // Use Link only if no children, otherwise use toggle button
        const buttonProps = hasChildren 
          ? { onClick: () => handleToggle(item.title) } 
          : { component: Link, href: getFullLocalizedPath(item.href || "#") };

        return (
          <div key={item.title} style={{ width: "100%" }}>
            <ListItemButton
              {...buttonProps}
              sx={{
                px: 3,
                py: 1,
                bgcolor: activeItem
                  ? theme.palette.primary._alpha.main_08
                  : "transparent",
                color: activeItem
                  ? theme.palette.primary.main
                  : "text.secondary",
                "&:hover": {
                  bgcolor: theme.palette.primary._alpha.main_04,
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
                    const subActive = isActive(sub.href);
                    return (
                      <ListItemButton
                        key={sub.title}
                        component={Link}
                        href={getFullLocalizedPath(sub.href)}
                        sx={{
                          pl: 7,
                          py: 0.75,
                          color: subActive
                            ? theme.palette.primary.main
                            : "text.secondary",
                          bgcolor: subActive
                            ? theme.palette.primary._alpha.main_05
                            : "transparent",
                          "&:hover": {
                            color: theme.palette.primary.main,
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
}
