import GoogleMapView from "@/app/components/map";
import CustomCard from "../../../cards/card";

interface MapVehicleOverviewCardProps {
  id: string;
  name: string;
  location?: { lat: number; lng: number } | null;
}

const MapVehicleOverviewCard = ({
  id,
  name,
  location,
}: MapVehicleOverviewCardProps) => {
  const vehicleMarker = location
    ? [
        {
          position: location,
          name: name,
          id: id,
          type: "V",
        },
      ]
    : [];

  return (
    <CustomCard sx={{ flexGrow: 1, padding: 0 }}>
      {location ? (
        <GoogleMapView warehouseLoc={vehicleMarker} />
      ) : (
        <div style={{ padding: 20, textAlign: "center" }}>
          No location data available
        </div>
      )}
    </CustomCard>
  );
};

export default MapVehicleOverviewCard;
