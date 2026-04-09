import * as Yup from "yup";
import { Dictionary, formatMessage } from "./language/language";

/* --------------------------- Auth Validation --------------------------- */
export const getLoginValidationSchema = (dict: Dictionary) =>
  Yup.object({
    email: Yup.string()
      .email(dict.validation.email)
      .required(formatMessage(dict.validation.required, { field: dict.auth.email })),
    password: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.auth.password })
    ),
  });

export const getSignUpValidationSchema = (dict: Dictionary) => [
  Yup.object({
    name: Yup.string()
      .min(2, formatMessage(dict.validation.min, { field: dict.drivers.fields.firstName, min: 2 }))
      .required(formatMessage(dict.validation.required, { field: dict.drivers.fields.firstName })),
    surname: Yup.string()
      .min(2, formatMessage(dict.validation.min, { field: dict.drivers.fields.lastName, min: 2 }))
      .required(formatMessage(dict.validation.required, { field: dict.drivers.fields.lastName })),
    email: Yup.string()
      .email(dict.validation.email)
      .required(formatMessage(dict.validation.required, { field: dict.auth.email })),
  }),
  Yup.object({
    password: Yup.string()
      .min(8, formatMessage(dict.validation.min, { field: dict.auth.password, min: 8 }))
      .matches(/[a-z]/, formatMessage(dict.validation.matches, { field: dict.auth.password }))
      .matches(/[A-Z]/, formatMessage(dict.validation.matches, { field: dict.auth.password }))
      .matches(/[0-9]/, formatMessage(dict.validation.matches, { field: dict.auth.password }))
      .required(formatMessage(dict.validation.required, { field: dict.auth.password })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required(formatMessage(dict.validation.required, { field: "Repeat password" })),
  }),
  Yup.object({}),
];

/* --------------------------- Vehicle Validation --------------------------- */
export const getAddVehicleValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    fleetNo: Yup.string()
      .optional()
      .min(3, formatMessage(dict.validation.min, { field: "Fleet No", min: 3 })),
    plate: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.plate }))
      .min(5, formatMessage(dict.validation.min, { field: dict.vehicles.fields.plate, min: 5 })),
    type: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.type }))
      .oneOf(["TRUCK", "VAN"], formatMessage(dict.validation.oneOf, { field: dict.vehicles.fields.type })),
    brand: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.brand }))
      .min(2, formatMessage(dict.validation.min, { field: dict.vehicles.fields.brand, min: 2 })),
    model: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.model }))
      .min(1, formatMessage(dict.validation.required, { field: dict.vehicles.fields.model })),
    year: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.year }))
      .min(1900, formatMessage(dict.validation.min, { field: dict.vehicles.fields.year, min: 1900 }))
      .max(2100, formatMessage(dict.validation.max, { field: dict.vehicles.fields.year, max: 2100 }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.year })),
    maxLoadKg: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.capacity }))
      .min(1, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.capacity }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.capacity })),
    fuelType: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.fuelType }))
      .oneOf(
        ["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"],
        formatMessage(dict.validation.oneOf, { field: dict.vehicles.fields.fuelType })
      ),
    odometerKm: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.odometer }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.odometer }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.odometer })),
    nextServiceKm: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.service }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.service }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.service })),
    avgFuelConsumption: Yup.number()
      .required(formatMessage(dict.validation.required, { field: "Fuel Consumption" }))
      .min(0, formatMessage(dict.validation.positive, { field: "Fuel Consumption" })),
    techNotes: Yup.string().optional(),
    transmission: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.transmission }))
      .oneOf(["MANUAL", "AUTOMATIC", "AMULTI"], formatMessage(dict.validation.oneOf, { field: dict.vehicles.fields.transmission })),
    engineSize: Yup.number()
      .required(formatMessage(dict.validation.required, { field: "Engine Size" }))
      .min(0, formatMessage(dict.validation.positive, { field: "Engine Size" })),
    fuelLevel: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.fuelLevel }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.fuelLevel }))
      .max(100, formatMessage(dict.validation.max, { field: dict.vehicles.fields.fuelLevel, max: 100 }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.fuelLevel })),
  });

export const getEditVehicleValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    type: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.type }))
      .oneOf(["TRUCK", "VAN"], formatMessage(dict.validation.oneOf, { field: dict.vehicles.fields.type })),
    brand: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.brand }))
      .min(2, formatMessage(dict.validation.min, { field: dict.vehicles.fields.brand, min: 2 })),
    model: Yup.string().required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.model })).min(1, formatMessage(dict.validation.required, { field: dict.vehicles.fields.model })),
    year: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.year }))
      .min(1900, formatMessage(dict.validation.min, { field: dict.vehicles.fields.year, min: 1900 }))
      .max(2100, formatMessage(dict.validation.max, { field: dict.vehicles.fields.year, max: 2100 }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.year })),
    maxLoadKg: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.capacity }))
      .min(1, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.capacity }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.capacity })),
    fuelType: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.fuelType }))
      .oneOf(["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"], formatMessage(dict.validation.oneOf, { field: dict.vehicles.fields.fuelType })),
    status: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.vehicles.fields.status }))
      .oneOf(["AVAILABLE", "ON_TRIP", "MAINTENANCE"], formatMessage(dict.validation.oneOf, { field: dict.vehicles.fields.status })),
    odometerKm: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.odometer }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.odometer })),
    nextServiceKm: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: dict.vehicles.fields.service }))
      .integer(formatMessage(dict.validation.integer, { field: dict.vehicles.fields.service })),
    avgFuelConsumption: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: "Fuel Consumption" })),
  });

/* --------------------------- Driver Validation --------------------------- */
export const getAddDriverValidationSchema = (dict: Dictionary) =>
  Yup.object({
    userId: Yup.string().required(formatMessage(dict.validation.required, { field: "Employee" })),
    phone: Yup.string().required(formatMessage(dict.validation.required, { field: dict.drivers.fields.phoneNumber })),
    licenseNumber: Yup.string().required(formatMessage(dict.validation.required, { field: dict.drivers.fields.licenseNumber })),
    licenseType: Yup.string().required(formatMessage(dict.validation.required, { field: "License Type" })),
    licenseExpiry: Yup.date().nullable().required(formatMessage(dict.validation.required, { field: "License Expiry" })),
    employeeId: Yup.string().required(formatMessage(dict.validation.required, { field: "Employee ID" })),
    status: Yup.string().required(formatMessage(dict.validation.required, { field: dict.drivers.fields.status })),
    homeWareHouseId: Yup.string().optional(),
    currentVehicleId: Yup.string().optional(),
    languages: Yup.array().of(Yup.string()).optional(),
    hazmatCertified: Yup.boolean().optional(),
  });

export const getEditDriverValidationSchema = (dict: Dictionary) =>
  Yup.object({
    phone: Yup.string().required(formatMessage(dict.validation.required, { field: dict.drivers.fields.phoneNumber })),
    licenseNumber: Yup.string().required(formatMessage(dict.validation.required, { field: dict.drivers.fields.licenseNumber })),
    licenseType: Yup.string().required(formatMessage(dict.validation.required, { field: "License Type" })),
    licenseExpiry: Yup.date().nullable().required(formatMessage(dict.validation.required, { field: "License Expiry" })),
    employeeId: Yup.string().required(formatMessage(dict.validation.required, { field: "Employee ID" })),
    status: Yup.string().required(formatMessage(dict.validation.required, { field: dict.drivers.fields.status })),
    homeWareHouseId: Yup.string().optional(),
    currentVehicleId: Yup.string().optional(),
    languages: Yup.array().of(Yup.string()).optional(),
    hazmatCertified: Yup.boolean().optional(),
  });

/* --------------------------- Inventory Validation --------------------------- */
export const getAddInventoryValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    warehouseId: Yup.string().required(formatMessage(dict.validation.required, { field: dict.inventory.fields.warehouse })),
    sku: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.inventory.fields.sku }))
      .min(3, formatMessage(dict.validation.min, { field: dict.inventory.fields.sku, min: 3 })),
    name: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.inventory.fields.name }))
      .min(2, formatMessage(dict.validation.min, { field: dict.inventory.fields.name, min: 2 })),
    quantity: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.inventory.fields.quantity }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.inventory.fields.quantity }))
      .integer(formatMessage(dict.validation.integer, { field: dict.inventory.fields.quantity })),
    minStock: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.inventory.fields.minStock }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.inventory.fields.minStock }))
      .integer(formatMessage(dict.validation.integer, { field: dict.inventory.fields.minStock })),
    unit: Yup.string().required(formatMessage(dict.validation.required, { field: "Unit" })),
    unitValue: Yup.number().nullable().min(0, formatMessage(dict.validation.positive, { field: dict.inventory.fields.unitValue })),
    imageUrl: Yup.string().url(dict.validation.url).nullable().optional(),
    weightKg: Yup.number().nullable().min(0, formatMessage(dict.validation.positive, { field: dict.inventory.fields.weight })),
    volumeM3: Yup.number().nullable().min(0, formatMessage(dict.validation.positive, { field: dict.inventory.fields.volume })),
    palletCount: Yup.number().nullable().min(0, formatMessage(dict.validation.positive, { field: dict.inventory.fields.pallets })),
    cargoType: Yup.string().optional(),
  });

/* --------------------------- Shipment Validation --------------------------- */
export const getAddShipmentValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    referenceNumber: Yup.string().required(formatMessage(dict.validation.required, { field: "Reference Number" })),
    priority: Yup.string()
      .required(formatMessage(dict.validation.required, { field: "Priority" }))
      .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], formatMessage(dict.validation.oneOf, { field: "Priority" })),
    type: Yup.string().required(formatMessage(dict.validation.required, { field: "Shipment Type" })),
    slaDeadline: Yup.date().nullable().required(formatMessage(dict.validation.required, { field: "SLA Deadline" })),
    originWarehouseId: Yup.string().required(formatMessage(dict.validation.required, { field: "Origin Warehouse" })),
    destination: Yup.string().required(formatMessage(dict.validation.required, { field: "Destination" })),
    customerId: Yup.string().required(formatMessage(dict.validation.required, { field: "Customer" })),
    customerLocationId: Yup.string().required(formatMessage(dict.validation.required, { field: "Location" })),
    contactEmail: Yup.string().email(dict.validation.email).required(formatMessage(dict.validation.required, { field: "Contact Email" })),
    palletCount: Yup.number().required(formatMessage(dict.validation.required, { field: "Pallet Count" })).min(0).integer(),
  });

export const getEditShipmentValidationSchema = (dict: Dictionary) => getAddShipmentValidationSchema(dict);

/* --------------------------- Route Validation --------------------------- */
export const getAddRouteValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    name: Yup.string().required(formatMessage(dict.validation.required, { field: "Name" })).min(3, formatMessage(dict.validation.min, { field: "Name", min: 3 })),
    startTime: Yup.date().nullable().required(formatMessage(dict.validation.required, { field: "Start Time" })),
    endTime: Yup.date()
      .nullable()
      .required(formatMessage(dict.validation.required, { field: "End Time" }))
      .min(Yup.ref("startTime"), "End time must be after start time"),
    startAddress: Yup.string().required(formatMessage(dict.validation.required, { field: "Start Address" })),
    endAddress: Yup.string().required(formatMessage(dict.validation.required, { field: "End Address" })),
    driverId: Yup.string().required(formatMessage(dict.validation.required, { field: "Driver" })),
    vehicleId: Yup.string().required(formatMessage(dict.validation.required, { field: "Vehicle" })),
  });

export const getEditRouteValidationSchema = (dict: Dictionary) => getAddRouteValidationSchema(dict);

/* --------------------------- Warehouse Validation --------------------------- */
export const getAddWarehouseValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    name: Yup.string()
      .required(formatMessage(dict.validation.required, { field: "Name" }))
      .min(3, formatMessage(dict.validation.min, { field: "Name", min: 3 })),
    code: Yup.string()
      .required(formatMessage(dict.validation.required, { field: "Code" }))
      .min(3, formatMessage(dict.validation.min, { field: "Code", min: 3 })),
    type: Yup.string()
      .required(formatMessage(dict.validation.required, { field: "Type" }))
      .oneOf(["DISTRIBUTION_CENTER", "CROSSDOCK", "WAREHOUSE"], formatMessage(dict.validation.oneOf, { field: "Type" })),
    address: Yup.string().required(formatMessage(dict.validation.required, { field: "Address" })),
    city: Yup.string().required(formatMessage(dict.validation.required, { field: "City" })),
    country: Yup.string().required(formatMessage(dict.validation.required, { field: "Country" })),
    capacityPallets: Yup.number()
      .required(formatMessage(dict.validation.required, { field: "Capacity" }))
      .min(0, formatMessage(dict.validation.positive, { field: "Capacity" }))
      .integer(formatMessage(dict.validation.integer, { field: "Capacity" })),
    capacityVolumeM3: Yup.number()
      .required(formatMessage(dict.validation.required, { field: "Volume" }))
      .min(0, formatMessage(dict.validation.positive, { field: "Volume" }))
      .integer(formatMessage(dict.validation.integer, { field: "Volume" })),
  });

/* --------------------------- Issue Validation --------------------------- */
export const getVehicleReportIssueValidationSchema = (dict: Dictionary) =>
  Yup.object({
    type: Yup.string().required(formatMessage(dict.validation.required, { field: "Issue Type" })),
    severity: Yup.string().required(formatMessage(dict.validation.required, { field: "Severity" })),
    description: Yup.string()
      .min(10, formatMessage(dict.validation.min, { field: "Description", min: 10 }))
      .required(formatMessage(dict.validation.required, { field: "Description" })),
  });

/* --------------------------- Company Validation --------------------------- */
export const getCreateCompanyValidationSchema = (dict: Dictionary) =>
  Yup.object({
    name: Yup.string()
      .min(2, formatMessage(dict.validation.min, { field: "Company Name", min: 2 }))
      .required(formatMessage(dict.validation.required, { field: "Company Name" })),
    industry: Yup.string().required(formatMessage(dict.validation.required, { field: "Industry" })),
    timezone: Yup.string().required(formatMessage(dict.validation.required, { field: "Timezone" })),
    currency: Yup.string().required(formatMessage(dict.validation.required, { field: "Currency" })),
  });

export const getAddCompanyMemberValidationSchema = (dict: Dictionary) =>
  Yup.object({
    email: Yup.string()
      .email(dict.validation.email)
      .required(formatMessage(dict.validation.required, { field: dict.auth.email })),
    role: Yup.string().required(formatMessage(dict.validation.required, { field: "Role" })),
    firstName: Yup.string().required(formatMessage(dict.validation.required, { field: "First Name" })),
    lastName: Yup.string().required(formatMessage(dict.validation.required, { field: "Last Name" })),
  });

export const getEditCompanyMemberValidationSchema = (dict: Dictionary) =>
  Yup.object({
    name: Yup.string().required(formatMessage(dict.validation.required, { field: "First Name" })),
    surname: Yup.string().required(formatMessage(dict.validation.required, { field: "Last Name" })),
    roleId: Yup.string().required(formatMessage(dict.validation.required, { field: "Role" })),
    status: Yup.string().required(formatMessage(dict.validation.required, { field: "Status" })),
  });

/* --------------------------- Customer Validation --------------------------- */
export const getAddCustomerValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    name: Yup.string()
      .required(formatMessage(dict.validation.required, { field: "Company Name" }))
      .min(2, formatMessage(dict.validation.min, { field: "Company Name", min: 2 })),
    code: Yup.string()
      .optional()
      .min(2, formatMessage(dict.validation.min, { field: "Code", min: 2 })),
    industry: Yup.string().required(formatMessage(dict.validation.required, { field: "Industry" })),
    taxId: Yup.string().optional(),
    email: Yup.string().email(dict.validation.email).optional(),
    phone: Yup.string().optional(),
    locations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(formatMessage(dict.validation.required, { field: "Location Name" })),
        address: Yup.string().required(formatMessage(dict.validation.required, { field: "Address" })),
        lat: Yup.number().optional(),
        lng: Yup.number().optional(),
        isDefault: Yup.boolean().optional(),
      })
    ),
  });

export const getEditCustomerValidationSchema = (dict: Dictionary) => getAddCustomerValidationSchema(dict);

/* --------------------------- Remaining Schemas (Temporary Backwards Compatibility) --------------------------- */
// These will be fully migrated as components are updated.
export const loginValidationSchema = (dict: Dictionary) => getLoginValidationSchema(dict);
export const signUpValidationSchema = (dict: Dictionary) => getSignUpValidationSchema(dict);
export const addVehicleValidationSchema = (dict: Dictionary) => getAddVehicleValidationSchema(dict);
export const editVehicleValidationSchema = (dict: Dictionary) => getEditVehicleValidationSchema(dict);
export const addDriverValidationSchema = (dict: Dictionary) => getAddDriverValidationSchema(dict);
export const editDriverValidationSchema = (dict: Dictionary) => getEditDriverValidationSchema(dict);
export const addInventoryValidationSchema = (dict: Dictionary) => getAddInventoryValidationSchema(dict);
export const addShipmentValidationSchema = (dict: Dictionary) => getAddShipmentValidationSchema(dict);
export const editShipmentValidationSchema = (dict: Dictionary) => getEditShipmentValidationSchema(dict);
export const addRouteValidationSchema = (dict: Dictionary) => getAddRouteValidationSchema(dict);
export const editRouteValidationSchema = (dict: Dictionary) => getEditRouteValidationSchema(dict);
export const addWarehouseValidationSchema = (dict: Dictionary) => getAddWarehouseValidationSchema(dict);
export const vehicleReportIssueValidationSchema = (dict: Dictionary) => getVehicleReportIssueValidationSchema(dict);
export const createCompanyValidationSchema = (dict: Dictionary) => getCreateCompanyValidationSchema(dict);
export const addCompanyMemberValidationSchema = (dict: Dictionary) => getAddCompanyMemberValidationSchema(dict);
export const editCompanyMemberValidationSchema = (dict: Dictionary) => getEditCompanyMemberValidationSchema(dict);
export const addCustomerValidationSchema = (dict: Dictionary) => getAddCustomerValidationSchema(dict);
export const editCustomerValidationSchema = (dict: Dictionary) => getEditCustomerValidationSchema(dict);
