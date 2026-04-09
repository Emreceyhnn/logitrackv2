"use client";

import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter, usePathname, useParams } from "next/navigation";

const LanguageSwitcher = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLang = (params?.lang as string) || "tr";

  const languages = [
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    if (lang === currentLang) return;

    // Replace the language segment in the pathname
    const segments = pathname.split("/");
    segments[1] = lang;
    const newPathname = segments.join("/");

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
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
        aria-controls={open ? "language-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <LanguageIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
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
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
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
              <CheckIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
