import React, { useMemo } from "react";
import CustomCard from "../../cards/card";
import { MapWithMarker, MarkerData } from "@/app/components/googleMaps/MapWithMarker";
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
        position: v.position,
        label: v.name,
        type: markerType,
      };
    });
  }, [stats]);

  if (!stats) return null;

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <GoogleMapsProvider>
        <MapWithMarker markers={markers} />
      </GoogleMapsProvider>
    </CustomCard>
  );
};

export default OverviewMapCard;
