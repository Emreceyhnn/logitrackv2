import { WarehouseType } from "@prisma/client";

export interface AddWarehouseBasicInfo {
  name: string;
  code: string;
  type: WarehouseType;
  openingTime?: string;
  closingTime?: string;
  is247: boolean;
}

export interface AddWarehouseLocation {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  managerId: string;
}

export interface AddWarehouseCapacity {
  capacityPallets: number;
  capacityVolumeM3: number;
  specifications: string[]; // e.g. ["Cold Storage", "Hazardous Logistics", "Bonded Warehouse"]
}

export interface AddWarehousePageState {
  data: {
    basicInfo: AddWarehouseBasicInfo;
    location: AddWarehouseLocation;
    capacity: AddWarehouseCapacity;
  };
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface AddWarehousePageActions {
  updateBasicInfo: (data: Partial<AddWarehouseBasicInfo>) => void;
  updateLocation: (data: Partial<AddWarehouseLocation>) => void;
  updateCapacity: (data: Partial<AddWarehouseCapacity>) => void;
  setStep: (step: number) => void;
  handleSubmit: () => Promise<void>;
  closeDialog: () => void;
  reset: () => void;
}

export interface AddWarehouseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
