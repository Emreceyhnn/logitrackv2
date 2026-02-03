import { Box, Divider, List, ListItem, Stack, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { ReactNode } from "react";
import { getOpenAlerts } from "@/app/lib/analyticsUtils";

export interface ActionRequiredItems {
    type: "vehicle" | "driver" | "SHIPMENT_DELAY" | "DOCUMENT_DUE" | "warehouse";
    title: string;
    message: string;
}

type ActionType = ActionRequiredItems["type"];

const setType: Record<ActionType, ReactNode> = {
    SHIPMENT_DELAY: <Box sx={{ bgcolor: "#336bae", width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}><LocalShippingIcon sx={{ color: "#fff", width: 18, height: 18, p: 0, m: 0 }} /></Box>,
    vehicle: <Box sx={{ bgcolor: "#cc2f2d", width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}><DirectionsCarIcon sx={{ color: "#fff", fontSize: 18 }} /></Box>,
    driver: <Box sx={{ bgcolor: "#d8a711", width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}><PersonIcon sx={{ color: "#fff", fontSize: 18 }} /></Box>,
    DOCUMENT_DUE: <Box sx={{ bgcolor: "#4662a8", width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}><SummarizeIcon sx={{ color: "#fff", fontSize: 18 }} /></Box>,
    warehouse: <Box sx={{ bgcolor: "#228954", width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}><WarehouseIcon sx={{ color: "#fff", fontSize: 18 }} /></Box>,
};


const ActionRequiredCard = () => {

    const alerts: ActionRequiredItems[] = getOpenAlerts() as ActionRequiredItems[];

    return (
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
            <Stack minWidth={400} >
                <Typography sx={{ fontSize: 18, fontWeight: 600, bgcolor: "#136b86", padding: 1 }}>
                    Action Required
                </Typography>
                <List sx={{ overflowY: "auto", maxHeight: 300, minHeight: 150 }}>
                    {alerts.map((i, index) => (
                        <Box key={index}>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    gap: 1,
                                }}
                            >
                                {setType[i.type]}

                                <Stack spacing={0.5} direction="row" alignItems={"end"}>
                                    <Typography fontSize={14} fontWeight={600}>
                                        {i.title}
                                    </Typography>
                                    <Typography fontSize={12} color="text.secondary">
                                        {i.message}
                                    </Typography>
                                </Stack>
                            </ListItem>

                            {index !== alerts.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </Stack>
        </CustomCard>
    );
};

export default ActionRequiredCard