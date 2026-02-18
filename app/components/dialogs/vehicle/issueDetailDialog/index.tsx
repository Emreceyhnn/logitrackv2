import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { updateIssue } from "@/app/lib/controllers/vehicle";

interface IssueDetailDialogProps {
  open: boolean;
  onClose: () => void;
  issue: any;
  onUpdate: () => void;
}

export default function IssueDetailDialog({
  open,
  onClose,
  issue,
  onUpdate,
}: IssueDetailDialogProps) {
  /* --------------------------------- states --------------------------------- */
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (issue) {
      setStatus(issue.status);
      setPriority(issue.priority);
    }
  }, [issue]);

  /* -------------------------------- handlers -------------------------------- */
  const handleUpdate = async () => {
    if (!issue) return;
    setLoading(true);
    setError(null);

    try {
      await updateIssue(issue.id, { status, priority });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------- render --------------------------------- */
  if (!issue) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Issue Details</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Issue Title
            </Typography>
            <Typography variant="h6">{issue.title}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">
              {issue.description || "No description provided."}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Reported Date
            </Typography>
            <Typography variant="body2">
              {new Date(issue.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Updating..." : "Update Issue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
