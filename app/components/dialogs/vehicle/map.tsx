import GoogleMapView from "@/app/components/map";
import mockData from "@/app/lib/mockData.json";
import CustomCard from "../../cards/card";

interface MapVehicleOverviewCardProps {
  id: string;
}

const MapVehicleOverviewCard = ({ id }: MapVehicleOverviewCardProps) => {
  const vehicles = mockData.fleet
    .filter((i) => i.id === id)
    .map((i) => ({
      position: i.currentStatus.location,
      name: i.plate,
      id: i.id,
      type: "V",
    }));

  return (
    <CustomCard sx={{ flexGrow: 1, padding: 0 }}>
      <GoogleMapView warehouseLoc={vehicles} />
    </CustomCard>
  );
};

export default MapVehicleOverviewCard;
