import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        paddingBlock: 1.8,
        borderRadius: "8px",
        backgroundColor: "#38bdf8",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <CircularProgress
        sx={{
          color: "rgba(255,255,255.0.5)",
        }}
      />
    </Box>
  );
}
