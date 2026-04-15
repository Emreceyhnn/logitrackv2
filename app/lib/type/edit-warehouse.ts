import { WarehouseType } from "./enums";
import { WarehouseWithRelations } from "./warehouse";

export interface EditWarehouseBasicInfo {
  name: string;
  code: string;
  type: WarehouseType;
  openingTime?: string;
  closingTime?: string;
  is247: boolean;
}

export interface EditWarehouseLocation {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  managerId: string;
}

export interface EditWarehouseCapacity {
  capacityPallets: number;
  capacityVolumeM3: number;
  specifications: string[];
}

export interface EditWarehousePageState {
  data: {
    basicInfo: EditWarehouseBasicInfo;
    location: EditWarehouseLocation;
    capacity: EditWarehouseCapacity;
  };
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface EditWarehousePageActions {
  updateBasicInfo: (data: Partial<EditWarehouseBasicInfo>) => void;
  updateLocation: (data: Partial<EditWarehouseLocation>) => void;
  updateCapacity: (data: Partial<EditWarehouseCapacity>) => void;
  setStep: (step: number) => void;
  handleSubmit: () => Promise<void>;
  closeDialog: () => void;
  reset: () => void;
}

export interface EditWarehouseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  warehouseData?: WarehouseWithRelations;
}
