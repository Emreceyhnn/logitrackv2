"use client";

import { Grid, Stack } from "@mui/material";
import { Dayjs } from "dayjs";
import { useEffect, useState, ChangeEvent } from "react";
import { useFormikContext } from "formik";
import { AddDriverDocument, DriverFormValues, EditDriverFormValues } from "@/app/lib/type/driver";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { useUser } from "@/app/hooks/useUser";
import { Warehouse } from "@/app/lib/type/enums";
import { VehicleStatus } from "@/app/lib/type/enums";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useDateSettings } from "@/app/hooks/useDateSettings";
import { formatDisplayDate } from "@/app/lib/utils/date";
import { logger } from "@/app/lib/logger";

import { OperationalAssignmentSection } from "./sections/OperationalAssignmentSection";
import { SettingsSection } from "./sections/SettingsSection";
import { AdditionalDocsSection } from "./sections/AdditionalDocsSection";
import { ProfileSummarySidebar } from "./sections/ProfileSummarySidebar";

interface DriverFormSecondStepProps {
  setStep: (step: number) => void;
  userSummary: {
    name: string;
    surname: string;
    email: string;
  } | null;
}

const DriverFormSecondStep = ({
  setStep,
  userSummary,
}: DriverFormSecondStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const { user } = useUser();
  const dateSettings = useDateSettings();
  const { values, setFieldValue } =
    useFormikContext<DriverFormValues | EditDriverFormValues>();

  /* --------------------------------- states --------------------------------- */
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([]);

  /* ------------------------------- lifecycles ------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [wData, vData] = await Promise.all([
          getWarehouses(),
          getVehicles({ status: [VehicleStatus.AVAILABLE] }),
        ]);
        setWarehouses(wData);
        setVehicles(vData);
      } catch (error) {
        logger.error("Failed to fetch Step 2 data:", error);
      }
    };
    fetchData();
  }, [user]);

  /* -------------------------------- handlers -------------------------------- */
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs: AddDriverDocument[] = Array.from(e.target.files).map(
        (file: File) => {
          const previewUrl = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined;
          return {
            id: crypto.randomUUID(),
            name: file.name,
            type: "OTHER",
            expiryDate: null,
            file: file,
            previewUrl,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            uploadedAt: formatDisplayDate(new Date(), dateSettings),
          };
        }
      );
      setFieldValue("documents", [...values.documents, ...newDocs]);
    }
  };

  const updateDocExpiry = (id: string, date: Dayjs | null) => {
    const updatedDocs = values.documents.map((doc) =>
      doc.id === id ? { ...doc, expiryDate: date ? date.toDate() : null } : doc
    );
    setFieldValue("documents", updatedDocs);
  };

  const removeDoc = (id: string) => {
    const docToRemove = values.documents.find((d) => d.id === id);
    if (docToRemove?.previewUrl) {
      URL.revokeObjectURL(docToRemove.previewUrl);
    }
    setFieldValue(
      "documents",
      values.documents.filter((doc) => doc.id !== id)
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7.5 }}>
        <Stack spacing={4}>
          <OperationalAssignmentSection warehouses={warehouses} vehicles={vehicles} />
          <SettingsSection />
          <AdditionalDocsSection 
            handleFileUpload={handleFileUpload} 
            updateDocExpiry={updateDocExpiry} 
            removeDoc={removeDoc} 
          />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 4.5 }}>
        <ProfileSummarySidebar setStep={setStep} userSummary={userSummary} />
      </Grid>
    </Grid>
  );
};

export default DriverFormSecondStep;
