"use client";

import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import {
  getLocalizedPath,
  getCanonicalPath,
} from "@/app/lib/language/navigation";

const LanguageSwitcher = () => {
  /* --------------------------------- STATES --------------------------------- */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const dict = useDictionary();
  const currentLang = (params?.lang as string) || "tr";

  const languages = [
    { code: "tr", label: dict.languages.tr, flag: "🇹🇷" },
    { code: "en", label: dict.languages.en, flag: "🇺🇸" },
  ];

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    if (lang === currentLang) return;

    const segments = pathname.split("/");
    const pathWithoutLang = segments.slice(2).join("/"); // skip empty and lang

    // 1. Get canonical path (English-like) from current localized path
    const canonical = getCanonicalPath(pathWithoutLang, currentLang);

    // 2. Get localized path for target language
    const localized = getLocalizedPath(canonical, lang);

    const newPathname = `/${lang}${localized}`;

    // Set cookie for persistence
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;

    router.push(newPathname);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ml: 1,
          bgcolor: theme.palette.primary._alpha.main_05,
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
          "&:hover": {
            bgcolor: theme.palette.primary._alpha.main_10,
          },
        }}
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <LanguageIcon
          fontSize="small"
          sx={{ color: theme.palette.text.secondary }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
            mt: 1.5,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider_alpha.main_10}`,
            borderRadius: 2,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: theme.palette.background.paper,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={currentLang === lang.code}
            sx={{
              py: 1.5,
              px: 2.5,
              minWidth: 180,
              gap: 2,
              "&.Mui-selected": {
                bgcolor: theme.palette.primary._alpha.main_10,
                "&:hover": {
                  bgcolor: theme.palette.primary._alpha.main_15,
                },
              },
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
              {lang.flag}
            </Typography>
            <ListItemText
              primary={lang.label}
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: currentLang === lang.code ? 600 : 400,
              }}
            />
            {currentLang === lang.code && (
              <CheckIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main }}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
