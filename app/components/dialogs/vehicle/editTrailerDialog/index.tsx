"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { TrailerType } from "@/app/lib/type/enums";
import { useTrailerMutations } from "@/app/hooks/useTrailers";
import { TrailerWithRelations } from "@/app/lib/type/trailer";

interface EditTrailerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  trailer: TrailerWithRelations | null;
}

export default function EditTrailerDialog({
  open,
  onClose,
  onSuccess,
  trailer,
}: EditTrailerDialogProps) {
  const dict = useDictionary();
  const { updateTrailer } = useTrailerMutations();

  const [formData, setFormData] = useState({
    plate: "",
    fleetNo: "",
    type: TrailerType.DRY_VAN as TrailerType,
    capacityVolumeM3: "" as string | number,
    maxLoadKg: "" as string | number,
    isColdChain: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trailer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        plate: trailer.plate || "",
        fleetNo: trailer.fleetNo || "",
        type: (trailer.type as TrailerType) || TrailerType.DRY_VAN,
        capacityVolumeM3: trailer.capacityVolumeM3 || "",
        maxLoadKg: trailer.maxLoadKg || "",
        isColdChain: !!trailer.isColdChain,
      });
    }
  }, [trailer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trailer) return;
    
    setIsSubmitting(true);
    try {
      await updateTrailer.mutateAsync({
        id: trailer.id,
        data: {
          ...formData,
          capacityVolumeM3: parseFloat(formData.capacityVolumeM3.toString()) || 0,
          maxLoadKg: parseInt(formData.maxLoadKg.toString()) || 0,
        },
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to update trailer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            {dict.trailers.editTrailer || "Edit Trailer"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label={dict.trailers.plate}
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                placeholder="34 ABC 123"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={dict.trailers.fleetNo}
                name="fleetNo"
                value={formData.fleetNo}
                onChange={handleChange}
                placeholder="T-001"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                required
                fullWidth
                label={dict.trailers.type}
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {Object.values(TrailerType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {dict.trailers.types[type as keyof typeof dict.trailers.types]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label={dict.trailers.capacity}
                name="capacityVolumeM3"
                value={formData.capacityVolumeM3}
                onChange={handleChange}
                inputProps={{ min: 0, step: "0.1" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label={dict.trailers.maxLoad}
                name="maxLoadKg"
                value={formData.maxLoadKg}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isColdChain"
                    checked={formData.isColdChain}
                    onChange={handleChange}
                  />
                }
                label={dict.trailers.coldChain}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" sx={{ textTransform: "none" }}>
            {dict.common.cancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {dict.common.save}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
