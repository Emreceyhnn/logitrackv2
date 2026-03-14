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
  title = "Loading Data...",
}: TableSkeletonProps) {
  return (
    <CustomCard sx={{ padding: "0 0 6px 0" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        {title}
      </Typography>
      <Divider />

      <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {Array.from(new Array(columns)).map((_, i) => (
                <TableCell key={i}>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from(new Array(rows)).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from(new Array(columns)).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
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
    </CustomCard>
  );
}
