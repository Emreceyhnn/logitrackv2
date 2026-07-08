"use client";

import { ReactNode, useState, useCallback, useMemo, memo } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  buildLocalizedHref,
  isPathActive,
} from "@/app/lib/language/navigation";

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

export type SidebarItem = {
  title: string;
  icon: ReactNode;
  href: string;
  subTitles?: { title: string; href: string }[];
};

export type Params = {
  items: SidebarItem[];
  lang: string;
  onMobileClose?: (() => void) | undefined;
};

/* -------------------------------------------------------------------------- */
/*  SidebarList                                                                 */
/* -------------------------------------------------------------------------- */

export const SidebarList = memo(function SidebarList({
  items,
  lang,
  onMobileClose,
}: Params) {
  const pathname = usePathname();
  const theme = useTheme();

  /* ---------------------------------------------------------------------- */
  /*  Helpers — pure functions, no side effects                               */
  /* ---------------------------------------------------------------------- */

  /** True if the localized sub-item path matches the current pathname exactly. */
  const isSubActive = useCallback(
    (href: string) => isPathActive(pathname, href, lang, true),
    [pathname, lang]
  );

  /** True if this parent item (or any of its children) is the active page. */
  const isParentActive = useCallback(
    (item: SidebarItem): boolean => {
      if (item.subTitles?.length) {
        return item.subTitles.some((sub) => isSubActive(sub.href));
      }
      return isPathActive(pathname, item.href, lang, true);
    },
    [pathname, lang, isSubActive]
  );

  /* ---------------------------------------------------------------------- */
  /*  Open-section state                                                       */
  /*                                                                          */
  /*  React 18 "adjusting state during render" pattern:                       */
  /*  – autoOpenKey is derived via useMemo (pure, no side effects)            */
  /*  – when the pathname changes, autoOpenKey changes too                    */
  /*  – we compare it against prevAutoOpenKey stored in state; when they      */
  /*    differ we update both synchronously during this render pass,          */
  /*    triggering an immediate re-render without an extra effect commit.     */
  /*  This avoids the "calling setState synchronously within an effect"       */
  /*  anti-pattern flagged by react-hooks/set-state-in-effect.                */
  /* ---------------------------------------------------------------------- */

  const autoOpenKey = useMemo<string | null>(() => {
    for (const item of items) {
      if (isParentActive(item)) return item.href;
    }
    return null;
  }, [items, isParentActive]);

  const [openKey, setOpenKey] = useState<string | null>(autoOpenKey);
  const [prevAutoOpenKey, setPrevAutoOpenKey] = useState<string | null>(
    autoOpenKey
  );

  // Synchronise openKey with pathname changes without an effect.
  if (prevAutoOpenKey !== autoOpenKey) {
    setPrevAutoOpenKey(autoOpenKey);
    setOpenKey(autoOpenKey);
  }

  /* ---------------------------------------------------------------------- */
  /*  Handlers                                                                 */
  /* ---------------------------------------------------------------------- */

  /** Toggle a collapsible parent section open / closed. */
  const handleToggle = useCallback((key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  }, []);

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <List
      disablePadding
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        width: "100%",
        px: 0,
      }}
    >
      {items.map((item) => {
        const hasChildren = Boolean(item.subTitles?.length);
        const isOpen = openKey === item.href;
        const parentActive = isParentActive(item);
        const localizedHref = buildLocalizedHref(item.href, lang);

        return (
          <Box key={item.href} sx={{ width: "100%" }}>
            {/* ---- Parent row ---- */}
            <ListItemButton
              component={hasChildren ? "div" : Link}
              {...(hasChildren ? {} : { href: localizedHref, prefetch: true })}
              onClick={
                hasChildren
                  ? () => handleToggle(item.href)
                  : onMobileClose
              }
              selected={parentActive}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                mx: 1,
                width: "calc(100% - 16px)",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                bgcolor: parentActive
                  ? theme.palette.primary._alpha.main_10
                  : "transparent",
                color: parentActive
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
                  color: parentActive ? theme.palette.primary.main : "inherit",
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: parentActive ? 700 : 500,
                  fontSize: 14,
                  letterSpacing: "0.01em",
                }}
              />

              {hasChildren && (
                <ExpandMoreIcon
                  sx={{
                    fontSize: 18,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              )}
            </ListItemButton>

            {/* ---- Children ---- */}
            {hasChildren && (
              <Collapse in={isOpen} timeout={300} unmountOnExit>
                <List disablePadding sx={{ width: "100%", mt: 0.5 }}>
                  {item.subTitles?.map((sub) => {
                    const subActive = isSubActive(sub.href);
                    const subLocalizedHref = buildLocalizedHref(sub.href, lang);

                    return (
                      <ListItemButton
                        key={sub.href}
                        component={Link}
                        href={subLocalizedHref}
                        prefetch={true}
                        onClick={onMobileClose ?? (() => {})}
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
          </Box>
        );
      })}
    </List>
  );
});
