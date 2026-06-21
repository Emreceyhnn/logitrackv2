import { useMemo } from "react";
import CustomCard from "../../cards/card";
import {
  MapWithMarker,
  MarkerData,
} from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { MapData } from "@/app/lib/type/overview";

interface OverviewMapCardProps {
  stats: MapData[] | null;
}

const OverviewMapCard = ({ stats }: OverviewMapCardProps) => {
  const markers = useMemo<MarkerData[]>(() => {
    if (!stats) return [];

    return stats.map((v) => {
      let markerType: MarkerData["type"] = "default";
      if (v.type === "W") markerType = "warehouse";
      else if (v.type === "V") markerType = "vehicle";
      else if (v.type === "C") markerType = "customer";

      return {
        id: v.id,
        position: v.position,
        label: v.name,
        type: markerType,
      };
    });
  }, [stats]);

  if (!stats) return null;

  const center = { lat: 39.9334, lng: 32.8597 }; // Default center (Ankara, Turkey)

  if (markers.length > 0) {
    const sum = markers.reduce(
      (acc, marker) => {
        return {
          lat: acc.lat + marker.position.lat,
          lng: acc.lng + marker.position.lng,
        };
      },
      { lat: 0, lng: 0 }
    );
    center.lat = sum.lat / markers.length;
    center.lng = sum.lng / markers.length;
  }

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <GoogleMapsProvider>
        <MapWithMarker center={center} markers={markers} height="500px" />
      </GoogleMapsProvider>
    </CustomCard>
  );
};

export default OverviewMapCard;
