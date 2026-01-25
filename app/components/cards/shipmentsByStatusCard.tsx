"use client"
import { Divider, Stack, Typography } from "@mui/material";
import CustomCard from "./card";
import { PieChart } from "@mui/x-charts";
import mockData from "@/app/lib/data.json";

const ShipmentOnStatusCard = () => {
    const values = mockData.shipments.map(i => i.status);

    const config = {
        IN_TRANSIT: { label: "In Transit", color: "#0088FE" },
        DELAYED: { label: "Delayed", color: "#00C49F" },
        PLANNED: { label: "Planned", color: "#FFBB28" },
    };

    const data = Object.entries(
        values.reduce<Record<string, number>>((acc, s) => {
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {})
    ).map(([key, value]) => ({
        id: key,
        label: config[key].label,
        value,
        color: config[key].color,
    }));

    return (
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                Shipment Status
            </Typography>
            <Divider />
            <Stack alignItems="center" sx={{ position: "relative" }} p={2}>
                <PieChart

                    series={[
                        {
                            data,
                            innerRadius: 40,
                            outerRadius: 80,
                            startAngle: -90,
                            endAngle: 90,

                        },
                    ]}
                    slotProps={{
                        legend: {
                            toggleVisibilityOnClick: true, direction: "horizontal", sx: {
                                position: "absolute",
                                bottom: 50,
                                zIndex: 2
                            }
                        }
                    }}
                    width={200}
                    height={240}
                />
            </Stack>
        </CustomCard>
    );
};

export default ShipmentOnStatusCard;
