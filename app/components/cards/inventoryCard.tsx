import mockData from "@/app/lib/data.json";
import CustomCard from "./card";
import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

const AlertInventoryCard = () => {


    const inventory = mockData.inventory.stockByWarehouse.flatMap(i =>
        i.lines
            .filter(y => y.onHand < 200)
            .map(y => ({
                item: y.skuId,
                warehouseId: i.warehouseId,
                onHand: y.onHand
            }))
    );

    return (
        <CustomCard>
            <Stack>
                <Typography>
                    Critique Stocks
                </Typography>
                <Stack>
                    {
                        inventory.map((i, index) => (
                            <React.Fragment key={index}>
                                <Stack direction={"row"} spacing={1} alignItems={"end"}>
                                    <Typography>{i.warehouseId}</Typography>
                                    <Typography>{`${i.item}: `}</Typography>
                                    <Typography fontWeight={300} fontSize={14} sx={{ color: "red" }}>{i.onHand}</Typography>
                                </Stack>

                                {index !== inventory.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    }
                </Stack>
            </Stack>
        </CustomCard>
    )
}


export default AlertInventoryCard