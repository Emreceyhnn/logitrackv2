import { ReactNode, useState } from "react";
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


export type SidebarItem = {
    title: string;
    icon: ReactNode;
    subTitles?: string[];
};


export type Params = {
    items: SidebarItem[]
}

export function SidebarList(params: Params) {
    const { items } = params
    const [openKey, setOpenKey] = useState<string | null>(null);

    const handleToggle = (title: string) => {
        setOpenKey(prev => (prev === title ? null : title));
    };

    return (
        <List disablePadding sx={{
            display: "flex",
            gap: 1,
            flexDirection: "column",
            padding: 0
        }}>
            {items.map(item => {
                const hasChildren = Boolean(item.subTitles?.length);
                const isOpen = openKey === item.title;

                return (
                    <div key={item.title} >
                        {/* Parent */}
                        <ListItemButton
                            onClick={() => hasChildren && handleToggle(item.title)}
                            sx={{ px: 3 }}

                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText primary={item.title} />

                            {hasChildren && (
                                <ExpandMoreIcon
                                    sx={{
                                        fontSize: 18,
                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "0.2s",
                                    }}
                                />
                            )}
                        </ListItemButton>

                        {/* Children */}
                        {hasChildren && (
                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <List disablePadding sx={{ px: 2 }}>
                                    {item?.subTitles?.map(sub => (
                                        <ListItemButton
                                            key={sub}


                                        >
                                            <ListItemText
                                                primary={sub}
                                                primaryTypographyProps={{ fontSize: 13 }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </div>
                );
            })}
        </List>
    );
}
