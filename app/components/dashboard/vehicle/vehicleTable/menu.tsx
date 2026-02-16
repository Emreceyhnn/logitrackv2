"use client";

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface DetailsMenuParams {
  handleOpenDetails: (id: string) => void;
  handleEdit?: (id: string) => void;
  handleDelete?: (id: string) => void;
  id: string;
}

const RowActions = (params: DetailsMenuParams) => {
  /* --------------------------------- states --------------------------------- */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        sx={{
          "& .MuiPaper-paper": {
            backgroundColor: "background.paper",
            borderRadius: 1,
            minWidth: 140,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            params.handleOpenDetails(params.id);
          }}
        >
          <ListItemIcon>
            <ContentPasteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>

        {params.handleEdit && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              params.handleEdit?.(params.id);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {params.handleDelete && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              params.handleDelete?.(params.id);
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default RowActions;
