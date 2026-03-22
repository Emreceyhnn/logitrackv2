"use client";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Typography,
  alpha,
  Box,
  useTheme,
} from "@mui/material";
import CustomCard from "../cards/card";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  title?: string;
}

export default function TableSkeleton({
  rows = 5,
  columns = 6,
  title,
}: TableSkeletonProps) {
  const theme = useTheme();

  return (
    <CustomCard sx={{ width: "100%", p: 0, overflow: "hidden" }}>
      {title && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: "white",
              letterSpacing: "-0.02em",
              mb: 2,
            }}
          >
            {title}
          </Typography>
          <Divider
            sx={{ borderColor: alpha(theme.palette.divider, 0.1), mb: 1 }}
          />
        </Box>
      )}

      <TableContainer sx={{ p: title ? 0 : 2, pt: title ? 0 : 3 }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}
          >
            <TableRow>
              {Array.from(new Array(columns)).map((_, i) => (
                <TableCell
                  key={i}
                  sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
                >
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{ bgcolor: alpha(theme.palette.text.primary, 0.1) }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from(new Array(rows)).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from(new Array(columns)).map((_, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
                  >
                    <Skeleton
                      animation="wave"
                      variant={colIndex === 1 ? "rounded" : "text"}
                      width={colIndex === 1 ? 80 : "80%"}
                      height={colIndex === 1 ? 24 : undefined}
                      sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
}
