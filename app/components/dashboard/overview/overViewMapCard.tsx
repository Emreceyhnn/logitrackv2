import CustomCard from "../../cards/card";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { MapData } from "@/app/lib/type/overview";

interface OverviewMapCardProps {
  values: MapData[];
}

const OverviewMapCard = ({ values }: OverviewMapCardProps) => {
  if (!values) return null;

  const markers = values.map((v) => ({
    position: v.position,
    label: v.name,
  }));

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <GoogleMapsProvider>
        <MapWithMarker markers={markers} />
      </GoogleMapsProvider>
    </CustomCard>
  );
};

export default OverviewMapCard;
