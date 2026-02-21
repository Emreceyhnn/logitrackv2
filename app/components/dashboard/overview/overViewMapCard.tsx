import CustomCard from "../../cards/card";
import GoogleMapView from "@/app/components/map";
import { MapData } from "@/app/lib/type/overview";

interface OverviewMapCardProps {
  values: MapData[];
}

const OverviewMapCard = ({ values }: OverviewMapCardProps) => {
  if (!values) return null;

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <GoogleMapView warehouseLoc={values} />
    </CustomCard>
  );
};

export default OverviewMapCard;
