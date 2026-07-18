import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import CustomCard from "../../cards/card";
import { MapData } from "@/app/lib/type/overview";
import { buildLocalizedHref } from "@/app/lib/language/navigation";
import { useLanguage, useDictionary } from "@/app/lib/language/DictionaryContext";
import { Box } from "@mui/material";

const MapWithMarkers = dynamic(() => import("../../valhalla/mapWithMarker"), {
  ssr: false,
});

interface OverviewMapCardProps {
  stats: MapData[] | null;
}

// Marker type → the entity list it drills into. Vehicles carry the operation
// (a moving shipment), so a vehicle marker deep-links to that vehicle's
// shipments; warehouses/customers go to their own list.
const DRILL_PATH: Record<MapData["type"], string> = {
  V: "/shipments",
  W: "/warehouses",
  C: "/customers",
};

const OverviewMapCard = ({ stats }: OverviewMapCardProps) => {
  const router = useRouter();
  const { lang } = useLanguage();
  const dict = useDictionary();

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

  const handleMarkerClick = (marker: { type: string; name: string; id: string }) => {
    const path = DRILL_PATH[marker.type as MapData["type"]];
    if (!path) return;
    const base = buildLocalizedHref(path, lang);
    // Vehicle → find its shipments by name/plate via the search filter;
    // warehouse/customer → their list highlighted by id.
    const href =
      marker.type === "V"
        ? `${base}?search=${encodeURIComponent(marker.name)}`
        : `${base}?id=${encodeURIComponent(marker.id)}`;
    router.push(href);
  };

  return (
    <CustomCard sx={{ flexGrow: 10, p: 2 }}>
      <Box sx={{ width: "100%", height: "500px" }}>
        <MapWithMarkers
          markers={markers || []}
          onMarkerClick={handleMarkerClick}
          detailsLabel={dict.common?.viewDetails}
        />
      </Box>
    </CustomCard>
  );
};

export default OverviewMapCard;
