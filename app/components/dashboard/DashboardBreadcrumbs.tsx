"use client";

import { Breadcrumbs, Link, Typography, Box, Tooltip } from "@mui/material";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { routeTranslations } from "@/app/lib/language/navigation";

const DashboardBreadcrumbs = () => {
  const pathname = usePathname();
  const dict = useDictionary();

  // The pathname looks like /tr/genel-bakis or /en/overview
  const segments = pathname.split("/").filter(Boolean);

  // First segment is usually the language (en/tr)
  const lang = segments[0] ?? "en";
  const breadcrumbSegments = segments.slice(1);

  // Helper to map segments to dictionary labels
  const getLabel = (segment: string) => {
    // Reverse map for the current language
    const reverseMap = Object.entries(routeTranslations[lang] || {}).reduce(
      (acc, [key, val]) => {
        acc[val] = key;
        return acc;
      },
      {} as Record<string, string>
    );

    const canonicalKey = reverseMap[segment] || segment;

    // Map canonical keys to dictionary labels
    const sidebarLabels: Record<string, string> = {
      overview: dict.sidebar.overview,
      vehicle: dict.sidebar.vehicles,
      vehicles: dict.sidebar.vehicles,
      drivers: dict.sidebar.drivers,
      routes: dict.sidebar.routes,
      shipments: dict.sidebar.shipments,
      warehouses: dict.sidebar.warehouses,
      inventory: dict.sidebar.inventory,
      customers: dict.sidebar.customers,
      analytics: dict.sidebar.analytics,
      reports: dict.sidebar.reports,
      company: dict.sidebar.company,
      // Common path segments
      add: dict.common.add,
      edit: dict.common.edit,
      details: dict.common.details,
      settings: dict.common.settings,
    };

    if (sidebarLabels[canonicalKey]) {
      return sidebarLabels[canonicalKey];
    }

    // Attempt mapping via common words dynamically if they exist
    const commonDict = dict.common as Record<string, unknown>;
    if (commonDict && typeof commonDict[canonicalKey] === "string") {
      return commonDict[canonicalKey] as string;
    }

    return (
      canonicalKey.charAt(0).toLocaleUpperCase("en-US") +
      canonicalKey.slice(1).replace(/-/g, " ")
    );
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize="small"
            sx={{
              color: "text.secondary",
              opacity: 0.4,
              mx: 0.5,
            }}
          />
        }
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
          },
        }}
      >
        <Link
          component={NextLink}
          href={`/${lang}/overview`}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            transition: "all 0.2s",
            "&:hover": {
              color: "primary.main",
              transform: "translateY(-1px)",
            },
          }}
        >
          <HomeOutlinedIcon sx={{ fontSize: 20 }} />
        </Link>

        {breadcrumbSegments.map((segment, index) => {
          const isLast = index === breadcrumbSegments.length - 1;
          const href = `/${segments.slice(0, index + 2).join("/")}`;
          const label = getLabel(segment);

          if (label === dict.sidebar.overview && index === 0) return null; // Skip redundant Overview if we have Home

          return isLast ? (
            <Tooltip key={href} title={dict.common.tooltips.details} arrow>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  letterSpacing: "0.01em",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                }}
              >
                {label}
              </Typography>
            </Tooltip>
          ) : (
            <Link
              key={href}
              component={NextLink}
              href={href}
              underline="none"
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                transition: "color 0.2s",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DashboardBreadcrumbs;
