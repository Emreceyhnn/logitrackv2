import { Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Route } from "@/app/lib/type/RoutesType";

interface Params {
    routeData: Route;
}

const RouteProgress = ({ routeData }: Params) => {
    return (
        <Stack>
            <Typography>
                Route Progress
            </Typography>
            <Stepper orientation="vertical">
                {routeData.stops.map((i, index) => (
                    <Step key={index} active>
                        <StepLabel>
                            <Typography>{i.ref.siteId ?? `${i.ref.warehouseId} (Origin)`}</Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}>Departed: 14.03</Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Stack>
    );
};

export default RouteProgress;
