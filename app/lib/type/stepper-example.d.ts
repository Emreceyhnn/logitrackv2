

/**
 * Domain context for the stepper example
 */
export interface StepperFormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;

  // Step 2: Professional Info
  companyName: string;
  role: string;
  experience: "junior" | "mid" | "senior" | "";

  // Step 3: Preferences
  notifications: boolean;
  newsletter: boolean;
  theme: "light" | "dark" | "system";
}

/**
 * Single Root State for the Stepper Page
 */
export interface StepperPageState {
  activeStep: number;
  formData: StepperFormData;
  isDialogOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Page Actions object
 */
export interface StepperPageActions {
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
  updateFormData: (data: Partial<StepperFormData>) => void;
  submitForm: () => Promise<void>;
  toggleDialog: (open: boolean) => void;
}

/**
 * Component Props passed from Parent to Children
 */
export interface StepperPageProps {
  state: StepperPageState;
  actions: StepperPageActions;
}

/**
 * Individual Step Component Props
 */
export interface StepComponentProps {
  formData: StepperFormData;
  updateFormData: (data: Partial<StepperFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}
