"use client";

import { Box } from "@mui/material";
import GoogleMapView from "@/app/components/map";
import { useEffect, useState } from "react";
import { useUser } from "@/app/lib/hooks/useUser";
import { getActiveRoutesLocations } from "@/app/lib/controllers/routes";

const RoutesMainMap = () => {
  const { user, loading } = useUser();
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!user) return;
      try {
        const data = await getActiveRoutesLocations(user.companyId, user.id);
        setVehicles(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (!loading && user) {
      fetchLocations();
    }
  }, [user, loading]);

  return (
    <Box sx={{ minHeight: 400, flexGrow: 3 }}>
      <GoogleMapView warehouseLoc={vehicles} />
    </Box>
  );
};

export default RoutesMainMap;
