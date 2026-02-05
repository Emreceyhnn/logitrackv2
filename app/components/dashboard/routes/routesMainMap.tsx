import { Box } from "@mui/material";
import GoogleMapView from "@/app/components/map";
import mockData from "@/app/lib/mockData.json";

const RoutesMainMap = () => {
  const vehicles = mockData.fleet
    .filter((v) => v.status === "ON_TRIP")
    .map((v) => {
      return {
        position: v.currentStatus.location,
        name: v.plate,
        id: v.id,
        type: "V",
      };
    });

  return (
    <Box sx={{ minHeight: 400, flexGrow: 3 }}>
      <GoogleMapView warehouseLoc={vehicles} />
    </Box>
  );
};

export default RoutesMainMap;
