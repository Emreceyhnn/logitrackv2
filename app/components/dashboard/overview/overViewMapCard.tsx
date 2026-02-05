import CustomCard from "../../cards/card";
import GoogleMapView from "@/app/components/map";
import { getMapData } from "@/app/lib/analyticsUtils";

const OverviewMapCard = () => {
  const values = getMapData();

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <GoogleMapView warehouseLoc={values} />
    </CustomCard>
  );
};

export default OverviewMapCard;
