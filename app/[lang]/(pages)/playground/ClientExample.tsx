"use client";

import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useMemo } from "react";
import { Box, Typography, Paper, Stack, Divider } from "@mui/material";

export default function ClientExample() {
  const dict = useDictionary();

  // useMemo is used here for performance when deriving complex UI structures 
  // from the dictionary. It ensures we don't recalculate this array unless 
  // the dictionary (locale) changes.
  const examples = useMemo(() => [
    { label: "Common Save", value: dict.common.save },
    { label: "Common Cancel", value: dict.common.cancel },
    { label: "Auth Sign In", value: dict.auth.signIn },
  ], [dict]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        bgcolor: "rgba(30, 41, 59, 0.5)", 
        border: "1px solid rgba(56, 189, 248, 0.2)",
        borderRadius: 4
      }}
    >
      <Typography variant="h6" color="#38bdf8" gutterBottom sx={{ fontWeight: 700 }}>
        Client Component Example
      </Typography>
      <Typography variant="body2" color="rgba(203, 213, 245, 0.7)" mb={2}>
        Using <code>useDictionary()</code> hook via context. <code>useMemo</code> is helpful here for performance.
      </Typography>
      
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />
      
      <Stack spacing={1.5}>
        {examples.map((ex) => (
          <Box key={ex.label} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="rgba(203, 213, 245, 0.6)">{ex.label}:</Typography>
            <Typography variant="body2" fontWeight={600}>{ex.value}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
