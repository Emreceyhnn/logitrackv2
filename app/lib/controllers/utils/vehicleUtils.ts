import { VehicleDashboardProps } from "../../type/vehicle";

export const VehicleKpiConverter = (props: VehicleDashboardProps[]) => {
  const totalVehicles = props.length;

  const available = props.filter((v) => v.status === "AVAILABLE").length;

  const inService = props.filter((v) => v.status === "MAINTENANCE").length;

  const onTrip = props.filter((v) => v.status === "ON_TRIP").length;

  const openIssues = props.filter((v) => v.issues.length > 0).length;

  const docsDueSoon = props.filter((v) => v.documents.length > 0).length;

  return {
    totalVehicles,
    available,
    inService,
    onTrip,
    openIssues,
    docsDueSoon,
  };
};

export const VehicleCapacityConverter = (props: VehicleDashboardProps[]) => {
  return props.map((v) => ({
    id: v.id,
    plate: v.plate,
    maxLoadKg: v.maxLoadKg,
  }));
};

export const VehicleDocumentConverter = (props: VehicleDashboardProps[]) => {
  return props.flatMap((v) =>
    v.documents.map((d) => ({
      id: v.id,
      plate: v.plate,
      documentType: d.type,
      expiryDate: d.expiryDate,
    }))
  );
};
