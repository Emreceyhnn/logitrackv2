import {
  Card,
  Box,
  Stack,
  Typography,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "#1976d2",
  trend,
  onClick,
  sx,
}: StatCardProps) => {
  const theme = useTheme();
  const dict = useDictionary();

  // Helper to resolve color to theme alpha tokens
  const resolveAlpha = (targetColor: string) => {
    // Check if it's a known KPI color
    if (targetColor.toLowerCase() === '#38bdf8') return (theme.palette as any).kpi_alpha.cyan;
    if (targetColor.toLowerCase() === '#6366f1') return (theme.palette as any).kpi_alpha.indigo;
    if (targetColor.toLowerCase() === '#10b981') return (theme.palette as any).kpi_alpha.emerald;
    if (targetColor.toLowerCase() === '#f59e0b') return (theme.palette as any).kpi_alpha.amber;
    if (targetColor.toLowerCase() === '#ec4899') return (theme.palette as any).kpi_alpha.pink;
    if (targetColor.toLowerCase() === '#8b5cf6') return (theme.palette as any).kpi_alpha.violet;
    if (targetColor.toLowerCase() === '#0ea5e9') return (theme.palette as any).kpi_alpha.sky;
    if (targetColor.toLowerCase() === '#a855f7') return (theme.palette as any).kpi_alpha.purple;
    if (targetColor.toLowerCase() === '#cbd5f5') return (theme.palette as any).kpi_alpha.slateLight;
    if (targetColor.toLowerCase() === '#1e293b') return (theme.palette as any).kpi_alpha.slateDark;
    if (targetColor.toLowerCase() === '#0f172a') return (theme.palette as any).kpi_alpha.slateDeep;
    if (targetColor.toLowerCase() === '#0b1120') return (theme.palette as any).kpi_alpha.slateDeepest;
    if (targetColor.toLowerCase() === '#94a3b8') return (theme.palette as any).kpi_alpha.slateGray;
    if (targetColor.toLowerCase() === '#e2e8f0') return (theme.palette as any).kpi_alpha.lavender;
    
    // Core palette matches
    if (targetColor === theme.palette.primary.main) return (theme.palette.primary as any)._alpha;
    if (targetColor === theme.palette.secondary.main) return (theme.palette.secondary as any)._alpha;
    if (targetColor === theme.palette.success.main) return (theme.palette.success as any)._alpha;
    if (targetColor === theme.palette.error.main) return (theme.palette.error as any)._alpha;
    if (targetColor === theme.palette.warning.main) return (theme.palette.warning as any)._alpha;
    if (targetColor === theme.palette.info.main) return (theme.palette.info as any)._alpha;

    // Fallback to primary alpha
    return (theme.palette.primary as any)._alpha;
  };

  const statusAlpha = resolveAlpha(color);
  const trendColorAlpha = trend ? (trend.isUp ? (theme.palette.success as any)._alpha : (theme.palette.error as any)._alpha) : null;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ height: '100%', flex: 1, display: 'flex' }}
    >
      <Card
        onClick={onClick}
        sx={{
          ...sx,
          height: "100%",
          minHeight: "160px",
          width: "100%",
          p: 3,
          borderRadius: "28px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: onClick ? "pointer" : "default",
          
          // Glassmorphism 2.0
          background: `linear-gradient(135deg, ${(theme.palette.background as any).paper_alpha.main_90} 0%, ${(theme.palette.background as any).paper_alpha.main_70} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${statusAlpha.main_15}`,
          
          // Outer and Inner Shadows (Depth)
          boxShadow: `
            0 10px 40px -10px ${(theme.palette.common as any).black_alpha.main_30},
            inset 0 0 20px 0 ${statusAlpha.main_05},
            inset 0 1px 1px 0 ${(theme.palette.common as any).white_alpha.main_10}
          `,
          
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${color}, ${statusAlpha.main_30})`,
            opacity: 0.8,
            transition: "all 0.3s ease",
          },
          
          "&:hover": {
            borderColor: statusAlpha.main_50,
            boxShadow: `
              0 20px 50px -12px ${statusAlpha.main_20},
              inset 0 0 30px 0 ${statusAlpha.main_10}
            `,
            "&::before": {
              height: "6px",
              opacity: 1,
            },
            "& .icon-aura": {
              transform: "scale(1.4)",
              opacity: 0.4,
            },
            "& .icon-box": {
              transform: "scale(1.15) rotate(10deg)",
              color: "#fff",
              bgcolor: color,
              boxShadow: `0 8px 20px ${statusAlpha.main_40}`,
            },
          },
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <Stack 
          direction="column" 
          justifyContent="space-between" 
          sx={{ 
            position: "relative", 
            zIndex: 1, 
            height: "100%",
            flexGrow: 1 
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  color: (theme.palette.text as any).primary_alpha.main_40,
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {title}
              </Typography>
              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "1.6rem", lg: "2rem" },
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Stack>

            {icon && (
              <Box sx={{ position: "relative" }}>
                {/* Icon Aura */}
                <Box
                  className="icon-aura"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "140%",
                    height: "140%",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${statusAlpha.main_60} 0%, transparent 70%)`,
                    transform: "translate(-50%, -50%) scale(0.8)",
                    opacity: 0.2,
                    zIndex: 0,
                    transition: "all 0.5s ease",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  className="icon-box"
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    p: 1.8,
                    borderRadius: "20px",
                    color: color,
                    bgcolor: statusAlpha.main_12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `inset 0 0 10px ${statusAlpha.main_10}`,
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  {icon}
                </Box>
              </Box>
            )}
          </Stack>

          {trend && (
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                mt: "auto", // Pushes trend to bottom if there's space
                pt: 3,
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                fontSize: "0.75rem",
                fontWeight: 800,
                color: trend.isUp ? theme.palette.success.main : theme.palette.error.main,
                bgcolor: trendColorAlpha?.main_12,
                width: "fit-content",
                px: 1.2,
                py: 0.6,
                borderRadius: "10px",
                boxShadow: `inset 0 0 5px ${trendColorAlpha?.main_10}`,
              }}
            >
            <Box component="span" sx={{ fontSize: "1rem" }}>{trend.isUp ? "↑" : "↓"}</Box>
            {trend.value}%
            <Typography component="span" sx={{ color: (theme.palette.text as any).primary_alpha.main_35, fontWeight: 600, ml: 0.5, fontSize: "0.7rem", letterSpacing: "0.02em" }}>
              {dict?.common?.fromLastMonth || "FROM LAST MONTH"}
            </Typography>
          </Box>
        )}
        </Stack>

        {/* Dynamic Glowing Mesh (Background) */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            right: "-20%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${statusAlpha.main_15} 0%, transparent 70%)`,
            filter: "blur(50px)",
            zIndex: 0,
            opacity: 0.6,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${statusAlpha.main_10} 0%, transparent 70%)`,
            filter: "blur(60px)",
            zIndex: 0,
            opacity: 0.3,
          }}
        />
      </Card>
    </motion.div>
  );
};

export default StatCard;
