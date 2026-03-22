import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
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
  const markers = location
    ? [
        {
          position: location,
          label: name,
          type: "vehicle" as const,
        },
      ]
    : [];

  return (
    <CustomCard sx={{ flexGrow: 1, padding: 0 }}>
      {location ? (
        <GoogleMapsProvider>
          <MapWithMarker markers={markers} />
        </GoogleMapsProvider>
      ) : (
        <div style={{ padding: 20, textAlign: "center" }}>
          No location data available
        </div>
      )}
    </CustomCard>
  );
};

export default MapVehicleOverviewCard;
