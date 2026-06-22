import { useMemo } from "react";
import dynamic from "next/dynamic";
import CustomCard from "../../cards/card";
import { MapData } from "@/app/lib/type/overview";
import { Box } from "@mui/material";

const MapWithMarkers = dynamic(() => import("../../valhalla/mapWithMarker"), {
  ssr: false,
});

interface OverviewMapCardProps {
  stats: MapData[] | null;
}

const OverviewMapCard = ({ stats }: OverviewMapCardProps) => {
  const markers = useMemo(() => {
    if (!stats) return [];

    return stats.map((v) => {
      return {
        id: v.id,
        lat: v.position.lat,
        len: v.position.lng,
        name: v.name,
        type: v.type,
      };
    });
  }, [stats]);

  if (!stats) return null;

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <Box sx={{ width: "100%", height: "500px" }}>
        <MapWithMarkers markers={markers || []} />
      </Box>
    </CustomCard>
  );
};

export default OverviewMapCard;
