import CustomCard from "../../cards/card";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { MapData } from "@/app/lib/type/overview";

interface OverviewMapCardProps {
  values: MapData[];
}

const OverviewMapCard = ({ values }: OverviewMapCardProps) => {
  if (!values) return null;

  const markers = values.map((v) => {
    let markerType: "warehouse" | "vehicle" | "customer" | "default" = "default";
    if (v.type === "W") markerType = "warehouse";
    else if (v.type === "V") markerType = "vehicle";
    else if (v.type === "C") markerType = "customer";

    return {
      position: v.position,
      label: v.name,
      type: markerType,
    };
  });

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <GoogleMapsProvider>
        <MapWithMarker markers={markers} />
      </GoogleMapsProvider>
    </CustomCard>
  );
};

export default OverviewMapCard;
