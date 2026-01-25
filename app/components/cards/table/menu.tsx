"use client"

import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

const RowActions = () => {
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
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                        <ContentPasteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Details</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={() => setAnchorEl(null)}
                    sx={{ color: "error.main" }}
                >
                    <ListItemIcon sx={{ color: "error.main" }}>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default RowActions;