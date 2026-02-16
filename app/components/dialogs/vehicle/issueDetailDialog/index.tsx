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
  TextField,
  Stack,
  Alert,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { updateIssue } from "@/app/lib/controllers/vehicle";
import { StatusChip } from "@/app/components/dashboard/chips/statusChips";
import { PriorityChip } from "@/app/components/dashboard/chips/priorityChips";

interface IssueDetailDialogProps {
  open: boolean;
  onClose: () => void;
  issue: any; // Using any for now as Issue type might be complex with relations
  onUpdate: () => void;
}

export default function IssueDetailDialog({
  open,
  onClose,
  issue,
  onUpdate,
}: IssueDetailDialogProps) {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (issue) {
      setStatus(issue.status);
      setPriority(issue.priority);
    }
  }, [issue]);

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
