import * as Yup from "yup";

/* --------------------------- Auth Validation --------------------------- */
export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const signUpValidationSchema = [
  Yup.object({
    name: Yup.string().min(2, "Name too short").required("Name is required"),
    surname: Yup.string()
      .min(2, "Surname too short")
      .required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
  Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Lowercase required")
      .matches(/[A-Z]/, "Uppercase required")
      .matches(/[0-9]/, "Number required")
      .required("Password is required"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Repeat password is required"),
  }),
  Yup.object({}),
];

/* --------------------------- Vehicle Validation --------------------------- */
export const addVehicleValidationSchema = Yup.object().shape({
  fleetNo: Yup.string()
    .optional()
    .min(3, "Fleet number must be at least 3 characters"),
  plate: Yup.string()
    .required("License plate is required")
    .min(5, "License plate must be at least 5 characters"),
  type: Yup.string()
    .required("Vehicle type is required")
    .oneOf(["TRUCK", "VAN"], "Invalid vehicle type"),
  brand: Yup.string()
    .required("Brand is required")
    .min(2, "Brand must be at least 2 characters"),
  model: Yup.string().required("Model is required").min(1, "Model is required"),
  year: Yup.number()
    .required("Year is required")
    .min(1900, "Year must be after 1900")
    .max(2100, "Year must be before 2100")
    .integer("Year must be a whole number"),
  maxLoadKg: Yup.number()
    .required("Max load is required")
    .min(1, "Max load must be greater than 0")
    .integer("Max load must be a whole number"),
  fuelType: Yup.string()
    .required("Fuel type is required")
    .oneOf(["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"], "Invalid fuel type"),
  odometerKm: Yup.number()
    .required("Current odometer reading is required")
    .min(0, "Odometer cannot be negative")
    .integer("Odometer must be a whole number"),
  nextServiceKm: Yup.number()
    .required("Next service interval is required")
    .min(0, "Next service cannot be negative")
    .integer("Next service must be a whole number"),
  avgFuelConsumption: Yup.number()
    .required("Average fuel consumption is required")
    .min(0, "Fuel consumption cannot be negative"),
  techNotes: Yup.string().optional(),
  transmission: Yup.string()
    .required("Transmission is required")
    .oneOf(["MANUAL", "AUTOMATIC", "AMULTI"], "Invalid transmission"),
  engineSize: Yup.number()
    .required("Engine size is required")
    .min(0, "Engine size cannot be negative"),
  fuelLevel: Yup.number()
    .required("Fuel level is required")
    .min(0, "Fuel level cannot be negative")
    .max(100, "Fuel level cannot be greater than 100")
    .integer("Fuel level must be a whole number"),
});

export const editVehicleValidationSchema = Yup.object().shape({
  type: Yup.string()
    .required("Vehicle type is required")
    .oneOf(["TRUCK", "VAN"], "Invalid vehicle type"),
  brand: Yup.string()
    .required("Brand is required")
    .min(2, "Brand must be at least 2 characters"),
  model: Yup.string().required("Model is required").min(1, "Model is required"),
  year: Yup.number()
    .required("Year is required")
    .min(1900, "Year must be after 1900")
    .max(2100, "Year must be before 2100")
    .integer("Year must be a whole number"),
  maxLoadKg: Yup.number()
    .required("Max load is required")
    .min(1, "Max load must be greater than 0")
    .integer("Max load must be a whole number"),
  fuelType: Yup.string()
    .required("Fuel type is required")
    .oneOf(["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"], "Invalid fuel type"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["AVAILABLE", "ON_TRIP", "MAINTENANCE"], "Invalid status"),
  odometerKm: Yup.number()
    .nullable()
    .min(0, "Odometer cannot be negative")
    .integer("Odometer must be a whole number"),
  nextServiceKm: Yup.number()
    .nullable()
    .min(0, "Next service cannot be negative")
    .integer("Next service must be a whole number"),
  avgFuelConsumption: Yup.number()
    .nullable()
    .min(0, "Fuel consumption cannot be negative"),
});

/* --------------------------- Vehicle Report Issue Validation --------------------------- */
export const vehicleReportIssueValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  priority: Yup.string()
    .required("Priority is required")
    .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], "Invalid priority"),
  description: Yup.string(),
});

/* --------------------------- Driver Validation --------------------------- */
export const addDriverValidationSchema = Yup.object({
  userId: Yup.string().required("Please select an employee"),
  phone: Yup.string().required("Phone number is required"),
  licenseNumber: Yup.string().required("License number is required"),
  licenseType: Yup.string().required("License type/class is required"),
  licenseExpiry: Yup.date().nullable().required("License expiry date is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  status: Yup.string().required("Status is required"),
  homeWareHouseId: Yup.string().optional(),
  currentVehicleId: Yup.string().optional(),
  languages: Yup.array().of(Yup.string()).optional(),
  hazmatCertified: Yup.boolean().optional(),
});

export const editDriverValidationSchema = Yup.object({
  phone: Yup.string().required("Phone number is required"),
  licenseNumber: Yup.string().required("License number is required"),
  licenseType: Yup.string().required("License type/class is required"),
  licenseExpiry: Yup.date().nullable().required("License expiry date is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  status: Yup.string().required("Status is required"),
  homeWareHouseId: Yup.string().optional(),
  currentVehicleId: Yup.string().optional(),
  languages: Yup.array().of(Yup.string()).optional(),
  hazmatCertified: Yup.boolean().optional(),
});

/* --------------------------- Customer Validation --------------------------- */
export const customerLocationValidationSchema = Yup.object().shape({
  name: Yup.string().required("Location name is required"),
  address: Yup.string().required("Full address is required"),
  lat: Yup.number().optional(),
  lng: Yup.number().optional(),
});

export const addCustomerValidationSchema = Yup.object({
  name: Yup.string()
    .required("Customer name is required")
    .min(2, "Name too short"),
  code: Yup.string().optional(),
  industry: Yup.string().optional(),
  taxId: Yup.string().optional(),
  email: Yup.string().email("Invalid email format").required(),
  phone: Yup.string().required(),
  locations: Yup.array()
    .of(customerLocationValidationSchema)
    .min(1, "At least one location is required"),
});

export const editCustomerValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  code: Yup.string().optional(),
  email: Yup.string().email("Invalid email").nullable(),
  phone: Yup.string().nullable(),
  taxId: Yup.string().nullable(),
  industry: Yup.string().nullable(),
  locations: Yup.array().of(customerLocationValidationSchema).optional(),
});

/* --------------------------- Company Validation --------------------------- */
export const createCompanyValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name too short")
    .required("Company Name is required"),
  industry: Yup.string().required("Industry is required"),
  timezone: Yup.string().required("Timezone is required"),
  currency: Yup.string().required("Currency is required"),
  language: Yup.string().required("Language is required"),
});

export const editCompanyMemberValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  roleId: Yup.string().required("Role is required"),
  status: Yup.string().required("Status is required"),
});

export const addCompanyMemberValidationSchema = Yup.object({
  employeeId: Yup.string().required("Employee ID is required"),
  phone: Yup.string().required("Phone number is required"),
  licenseNumber: Yup.string().optional(),
  licenseType: Yup.string().optional(),
  licenseExpiry: Yup.string().optional(),
});

/* --------------------------- Shipment Validation --------------------------- */
export const addShipmentValidationSchema = Yup.object().shape({
  referenceNumber: Yup.string().required("Reference number is required"),
  priority: Yup.string()
    .required("Priority is required")
    .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], "Invalid priority"),
  type: Yup.string().required("Shipment type is required"),
  slaDeadline: Yup.date().nullable().required("SLA Deadline is required"),
  originWarehouseId: Yup.string().required("Origin warehouse is required"),
  destination: Yup.string().required("Destination address is required"),
  customerId: Yup.string().required("Customer is required"),
  customerLocationId: Yup.string().required("Customer location is required"),
  contactEmail: Yup.string().email("Invalid email").required("Contact email is required"),
  weightKg: Yup.number().required("Weight is required").min(0),
  volumeM3: Yup.number().required("Volume is required").min(0),
  palletCount: Yup.number().required("Pallet count is required").min(0).integer(),
});

export const editShipmentValidationSchema = Yup.object().shape({
  referenceNumber: Yup.string().required("Reference number is required"),
  priority: Yup.string().required("Priority is required"),
  type: Yup.string().required("Shipment type is required"),
  slaDeadline: Yup.date().nullable().required("SLA Deadline is required"),
  originWarehouseId: Yup.string().required("Origin warehouse is required"),
  destination: Yup.string().required("Destination address is required"),
  customerId: Yup.string().required("Customer is required"),
  contactEmail: Yup.string().email("Invalid email").required("Contact email is required"),
  weightKg: Yup.number().required("Weight is required").min(0),
  volumeM3: Yup.number().required("Volume is required").min(0),
  palletCount: Yup.number().required("Pallet count is required").min(0).integer(),
});

/* --------------------------- Route Validation --------------------------- */
export const addRouteValidationSchema = Yup.object().shape({
  name: Yup.string().required("Route name is required").min(3),
  startTime: Yup.date().nullable().required("Start time is required"),
  endTime: Yup.date()
    .nullable()
    .required("End time is required")
    .min(Yup.ref("startTime"), "End time must be after start time"),
  startAddress: Yup.string().required("Start address is required"),
  endAddress: Yup.string().required("End address is required"),
  driverId: Yup.string().required("Please assign a driver"),
  vehicleId: Yup.string().required("Please assign a vehicle"),
});

export const editRouteValidationSchema = Yup.object().shape({
  name: Yup.string().required("Route name is required").min(3),
  startTime: Yup.date().nullable().required("Start time is required"),
  endTime: Yup.date()
    .nullable()
    .required("End time is required")
    .min(Yup.ref("startTime"), "End time must be after start time"),
  startAddress: Yup.string().required("Start address is required"),
  endAddress: Yup.string().required("End address is required"),
  driverId: Yup.string().required("Please assign a driver"),
  vehicleId: Yup.string().required("Please assign a vehicle"),
});

/* --------------------------- Warehouse Validation --------------------------- */
export const addWarehouseValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Warehouse name is required")
    .min(3, "Name must be at least 3 characters"),
  code: Yup.string()
    .required("Warehouse code is required")
    .min(3, "Code must be at least 3 characters"),
  type: Yup.string()
    .required("Warehouse type is required")
    .oneOf(["DISTRIBUTION_CENTER", "CROSSDOCK", "WAREHOUSE"], "Invalid warehouse type"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  capacityPallets: Yup.number()
    .required("Pallet capacity is required")
    .min(0, "Capacity cannot be negative")
    .integer("Must be a whole number"),
  capacityVolumeM3: Yup.number()
    .required("Volume capacity is required")
    .min(0, "Capacity cannot be negative")
    .integer("Must be a whole number"),
  operatingHours: Yup.string().optional(),
  managerId: Yup.string().nullable().optional(),
  specifications: Yup.array().of(Yup.string()).optional(),
});

export const editWarehouseValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Warehouse name is required")
    .min(3, "Name must be at least 3 characters"),
  code: Yup.string()
    .required("Warehouse code is required")
    .min(3, "Code must be at least 3 characters"),
  type: Yup.string()
    .required("Warehouse type is required")
    .oneOf(["DISTRIBUTION_CENTER", "CROSSDOCK", "WAREHOUSE"], "Invalid warehouse type"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  capacityPallets: Yup.number()
    .required("Pallet capacity is required")
    .min(0, "Capacity cannot be negative")
    .integer("Must be a whole number"),
  capacityVolumeM3: Yup.number()
    .required("Volume capacity is required")
    .min(0, "Capacity cannot be negative")
    .integer("Must be a whole number"),
  operatingHours: Yup.string().optional(),
  managerId: Yup.string().nullable().optional(),
  specifications: Yup.array().of(Yup.string()).optional(),
});

/* --------------------------- Inventory Validation --------------------------- */
export const addInventoryValidationSchema = Yup.object().shape({
  warehouseId: Yup.string().required("Warehouse is required"),
  sku: Yup.string()
    .required("SKU is required")
    .min(3, "SKU must be at least 3 characters"),
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name too short"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative")
    .integer("Must be a whole number"),
  minStock: Yup.number()
    .required("Minimum stock level is required")
    .min(0, "Minimum stock cannot be negative")
    .integer("Must be a whole number"),
  unit: Yup.string().required("Unit is required"),
  unitValue: Yup.number().nullable().min(0, "Unit value cannot be negative"),
  imageUrl: Yup.string().url("Invalid image URL").nullable().optional(),
  weightKg: Yup.number().nullable().min(0, "Weight cannot be negative"),
  volumeM3: Yup.number().nullable().min(0, "Volume cannot be negative"),
  palletCount: Yup.number().nullable().min(0, "Pallet count cannot be negative"),
  cargoType: Yup.string().optional(),
});

export const editInventoryValidationSchema = Yup.object().shape({
  warehouseId: Yup.string().required("Warehouse is required"),
  sku: Yup.string()
    .required("SKU is required")
    .min(3, "SKU must be at least 3 characters"),
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name too short"),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative")
    .integer("Must be a whole number"),
  minStock: Yup.number()
    .required("Minimum stock level is required")
    .min(0, "Minimum stock cannot be negative")
    .integer("Must be a whole number"),
  unit: Yup.string().required("Unit is required"),
  unitValue: Yup.number().nullable().min(0, "Unit value cannot be negative"),
  imageUrl: Yup.string().url("Invalid image URL").nullable().optional(),
  weightKg: Yup.number().nullable().min(0, "Weight cannot be negative"),
  volumeM3: Yup.number().nullable().min(0, "Volume cannot be negative"),
  palletCount: Yup.number().nullable().min(0, "Pallet count cannot be negative"),
  cargoType: Yup.string().optional(),
});
