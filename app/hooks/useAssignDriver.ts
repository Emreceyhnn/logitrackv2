import { useState, useCallback, useEffect } from "react";
import { assignDriverToVehicle, getAvailableDrivers, unassignDriverFromVehicle } from "@/app/lib/controllers/vehicle";
import { DriverWithUser } from "@/app/lib/type/vehicle";
import { logger } from "@/app/lib/logger";
import { Dictionary } from "@/app/lib/language/language";

export const useAssignDriver = (vehicleId: string, open: boolean, onClose: () => void, onSuccess: () => void, dict: Dictionary) => {
  const [drivers, setDrivers] = useState<DriverWithUser[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAvailableDrivers();
      setDrivers(data);
    } catch (err) {
      logger.error(err);
      setError(dict.vehicles.dialogs.failedToLoadDrivers);
    } finally {
      setLoading(false);
    }
  }, [dict.vehicles.dialogs.failedToLoadDrivers]);

  useEffect(() => {
    if (open) {
      fetchDrivers();
      setSelectedDriverId("");
      setError(null);
    }
  }, [open, fetchDrivers]);

  const handleAssign = async () => {
    if (!selectedDriverId) return;
    setActionLoading(true);
    try {
      await assignDriverToVehicle(vehicleId, selectedDriverId);
      onSuccess();
      onClose();
    } catch (err) {
      logger.error(err);
      setError(dict.vehicles.dialogs.failedToAssign);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnassign = async () => {
    setActionLoading(true);
    try {
      await unassignDriverFromVehicle(vehicleId);
      onSuccess();
      onClose();
    } catch (err) {
      logger.error(err);
      setError(dict.vehicles.dialogs.failedToUnassign);
    } finally {
      setActionLoading(false);
    }
  };

  return { drivers, selectedDriverId, setSelectedDriverId, loading, actionLoading, error, handleAssign, handleUnassign };
};
