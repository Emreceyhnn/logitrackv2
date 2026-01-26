import { Vehicle } from "@/app/lib/type/VehicleType";
import { Stack, Typography, Divider } from "@mui/material";

interface OverviewTabProps {
    vehicle?: Vehicle;
}

const OverviewTab = ({ vehicle }: OverviewTabProps) => {
    if (!vehicle) {
        return <Typography color="text.secondary">No vehicle selected</Typography>;
    }

    return (
        <Stack spacing={2}>
            {/* BASIC INFO */}
            <Section title="General">
                <Row label="Plate" value={vehicle.plate} />
                <Row label="Fleet No" value={vehicle.fleetNo} />
                <Row label="Type" value={vehicle.type} />
                <Row
                    label="Brand / Model"
                    value={`${vehicle.brand} ${vehicle.model} (${vehicle.year})`}
                />
                <Row label="Status" value={vehicle.status} />
                <Row
                    label="Odometer (km)"
                    value={vehicle.odometerKm.toLocaleString()}
                />
            </Section>

            <Divider />

            {/* TELEMETRY */}
            <Section title="Live Telemetry">
                <Row label="Speed (km/h)" value={vehicle.telemetry.speedKph} />
                <Row
                    label="Ignition"
                    value={vehicle.telemetry.ignitionOn ? "ON" : "OFF"}
                />
                <Row
                    label="Last Ping"
                    value={new Date(vehicle.telemetry.lastPingAt).toLocaleString()}
                />
                <Row
                    label="Location"
                    value={`${vehicle.telemetry.location.lat}, ${vehicle.telemetry.location.lng}`}
                />
            </Section>

            <Divider />

            {/* FUEL */}
            <Section title="Fuel">
                <Row label="Fuel Type" value={vehicle.fuel.type} />
                <Row label="Fuel Level (%)" value={vehicle.fuel.levelPct} />
                <Row
                    label="Consumption (L/100km)"
                    value={vehicle.fuel.consumptionLPer100Km}
                />
            </Section>
        </Stack>
    );
};

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <Stack spacing={1}>
        <Typography variant="subtitle1" fontWeight={700}>
            {title}
        </Typography>
        {children}
    </Stack>
);

const Row = ({ label, value }: { label: string; value: any }) => (
    <Stack direction="row" spacing={1}>
        <Typography fontWeight={600} minWidth={160}>
            {label}:
        </Typography>
        <Typography>{value}</Typography>
    </Stack>
);

export default OverviewTab;
