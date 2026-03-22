"use client";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Typography,
  alpha,
} from "@mui/material";

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
  return (
    <Paper
      sx={{
        width: "100%",
        mb: 2,
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "transparent",
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: 0,
      }}
    >
      {title && (
        <>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2, color: "white" }}>
            {title}
          </Typography>
          <Divider sx={{ borderColor: (theme) => alpha(theme.palette.divider, 0.1) }} />
        </>
      )}

      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03) }}>
            <TableRow>
              {Array.from(new Array(columns)).map((_, i) => (
                <TableCell key={i} sx={{ borderColor: (theme) => alpha(theme.palette.divider, 0.1) }}>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from(new Array(rows)).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from(new Array(columns)).map((_, colIndex) => (
                  <TableCell key={colIndex} sx={{ borderColor: (theme) => alpha(theme.palette.divider, 0.1) }}>
                    <Skeleton
                      animation="wave"
                      variant={colIndex === 1 ? "rounded" : "text"}
                      width={colIndex === 1 ? 80 : "80%"}
                      height={colIndex === 1 ? 24 : undefined}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
