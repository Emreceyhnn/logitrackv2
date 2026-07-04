// Client-safe validation schemas (Yup only). Server-action zod schemas live
// in ./validation/serverSchemas.ts — do NOT import zod or @prisma/client here:
// this module is bundled into every dialog on the client.
import * as Yup from "yup";
import { Dictionary, formatMessage } from "./language/language";

/* --------------------------- Auth Validation --------------------------- */
export const getLoginValidationSchema = (dict: Dictionary) =>
  Yup.object({
    email: Yup.string()
      .email(dict.validation.email)
      .required(
        formatMessage(dict.validation.required, { field: dict.auth.email })
      ),
    password: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.auth.password })
    ),
  });

export const getSignUpValidationSchema = (dict: Dictionary) => [
  Yup.object({
    name: Yup.string()
      .min(
        2,
        formatMessage(dict.validation.min, {
          field: dict.drivers.fields.firstName,
          min: 2,
        })
      )
      .required(
        formatMessage(dict.validation.required, {
          field: dict.drivers.fields.firstName,
        })
      ),
    surname: Yup.string()
      .min(
        2,
        formatMessage(dict.validation.min, {
          field: dict.drivers.fields.lastName,
          min: 2,
        })
      )
      .required(
        formatMessage(dict.validation.required, {
          field: dict.drivers.fields.lastName,
        })
      ),
    email: Yup.string()
      .email(dict.validation.email)
      .required(
        formatMessage(dict.validation.required, { field: dict.auth.email })
      ),
  }),
  Yup.object({
    password: Yup.string()
      .min(
        8,
        formatMessage(dict.validation.min, {
          field: dict.auth.password,
          min: 8,
        })
      )
      .matches(
        /[a-z]/,
        formatMessage(dict.validation.matches, { field: dict.auth.password })
      )
      .matches(
        /[A-Z]/,
        formatMessage(dict.validation.matches, { field: dict.auth.password })
      )
      .matches(
        /[0-9]/,
        formatMessage(dict.validation.matches, { field: dict.auth.password })
      )
      .required(
        formatMessage(dict.validation.required, { field: dict.auth.password })
      ),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], dict.validation.passwordsMatch || "Passwords must match")
      .required(
        formatMessage(dict.validation.required, { field: dict.auth?.repeatPassword || "Repeat password" })
      ),
  }),
  Yup.object({}),
];

/* --------------------------- Vehicle Validation --------------------------- */
export const getAddVehicleValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    fleetNo: Yup.string()
      .optional()
      .min(
        3,
        formatMessage(dict.validation.min, { field: dict.vehicles?.fields?.fleetNo || "Fleet No", min: 3 })
      ),
    plate: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.plate,
        })
      )
      .min(
        5,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.fields.plate,
          min: 5,
        })
      ),
    type: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.type,
        })
      )
      .oneOf(
        ["TRUCK", "VAN"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.type,
        })
      ),
    brand: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.brand,
        })
      )
      .min(
        2,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.fields.brand,
          min: 2,
        })
      ),
    model: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.model,
        })
      )
      .min(
        1,
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.model,
        })
      ),
    year: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.year,
        })
      )
      .min(
        1900,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.fields.year,
          min: 1900,
        })
      )
      .max(
        2100,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.year,
          max: 2100,
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.year,
        })
      ),
    maxLoadKg: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.capacity,
        })
      )
      .min(
        1,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.capacity,
        })
      )
      .max(
        2_000_000,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.capacity,
          max: "2,000,000",
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.capacity,
        })
      ),
    fuelType: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.fuelType,
        })
      )
      .oneOf(
        ["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.fuelType,
        })
      ),
    odometerKm: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.odometer,
        })
      )
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.odometer,
        })
      )
      .max(
        9_999_999,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.odometer,
          max: "9,999,999",
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.odometer,
        })
      ),
    nextServiceKm: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.service,
        })
      )
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.service,
        })
      )
      .max(
        9_999_999,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.service,
          max: "9,999,999",
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.service,
        })
      ),
    avgFuelConsumption: Yup.number()
      .required(
        formatMessage(dict.validation.required, { field: dict.vehicles?.fields?.fuelConsumption || "Fuel Consumption" })
      )
      .min(
        0,
        formatMessage(dict.validation.positive, { field: dict.vehicles?.fields?.fuelConsumption || "Fuel Consumption" })
      ),
    techNotes: Yup.string().optional(),
    transmission: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.transmission,
        })
      )
      .oneOf(
        ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.transmission,
        })
      ),
    engineSize: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.vehicles?.fields?.engineSize || "Engine Size" })
    ),
    fuelLevel: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.fuelLevel,
        })
      )
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.fuelLevel,
        })
      )
      .max(
        100,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.fuelLevel,
          max: 100,
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.fuelLevel,
        })
      ),
    fuelCapacity: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, { field: dict.vehicles?.fields?.fuelCapacity || "Fuel Capacity" })
      )
      .max(
        10_000,
        formatMessage(dict.validation.max, {
          field: dict.vehicles?.fields?.fuelCapacity || "Fuel Capacity",
          max: "10,000",
        })
      )
      .integer(
        formatMessage(dict.validation.integer, { field: dict.vehicles?.fields?.fuelCapacity || "Fuel Capacity" })
      ),
  });

export const getEditVehicleValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    plate: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.plate,
        })
      )
      .min(
        5,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.fields.plate,
          min: 5,
        })
      ),
    fleetNo: Yup.string()
      .optional()
      .min(
        3,
        formatMessage(dict.validation.min, { field: dict.vehicles?.fields?.fleetNo || "Fleet No", min: 3 })
      ),
    type: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.type,
        })
      )
      .oneOf(
        ["TRUCK", "VAN"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.type,
        })
      ),
    brand: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.brand,
        })
      )
      .min(
        2,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.fields.brand,
          min: 2,
        })
      ),
    model: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.model,
        })
      )
      .min(
        1,
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.model,
        })
      ),
    year: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.year,
        })
      )
      .min(
        1900,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.fields.year,
          min: 1900,
        })
      )
      .max(
        2100,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.year,
          max: 2100,
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.year,
        })
      ),
    maxLoadKg: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.capacity,
        })
      )
      .min(
        1,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.capacity,
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.capacity,
        })
      ),
    fuelType: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.fuelType,
        })
      )
      .oneOf(
        ["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.fuelType,
        })
      ),
    status: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.status,
        })
      )
      .oneOf(
        ["AVAILABLE", "ON_TRIP", "MAINTENANCE"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.status,
        })
      ),
    odometerKm: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.odometer,
        })
      )
      .max(
        9_999_999,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.odometer,
          max: "9,999,999",
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.odometer,
        })
      ),
    nextServiceKm: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.service,
        })
      )
      .max(
        9_999_999,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.service,
          max: "9,999,999",
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.vehicles.fields.service,
        })
      ),
    avgFuelConsumption: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, { field: dict.vehicles?.fields?.fuelConsumption || "Fuel Consumption" })
      ),
    engineSize: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.vehicles?.fields?.engineSize || "Engine Size" })
    ),
    transmission: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.fields.transmission,
        })
      )
      .oneOf(
        ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"],
        formatMessage(dict.validation.oneOf, {
          field: dict.vehicles.fields.transmission,
        })
      ),
    techNotes: Yup.string().optional(),
    fuelLevel: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.vehicles.fields.fuelLevel,
        })
      )
      .max(
        100,
        formatMessage(dict.validation.max, {
          field: dict.vehicles.fields.fuelLevel,
          max: 100,
        })
      ),
  });

/* --------------------------- Driver Validation --------------------------- */
export const getAddDriverValidationSchema = (dict: Dictionary) =>
  Yup.object({
    userId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.drivers?.fields?.employee || "Employee" })
    ),
    phone: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.phoneNumber,
      })
    ),
    licenseNumber: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.licenseNumber,
      })
    ),
    licenseType: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.drivers?.fields?.licenseType || "License Type" })
    ),
    licenseExpiry: Yup.date()
      .nullable()
      .required(
        formatMessage(dict.validation.required, { field: dict.drivers?.fields?.licenseExpiry || "License Expiry" })
      ),
    employeeId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.drivers?.fields?.employeeId || "Employee ID" })
    ),
    status: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.status,
      })
    ),
    homeWareHouseId: Yup.string().optional(),
    currentVehicleId: Yup.string().optional(),
    languages: Yup.array().of(Yup.string()).optional(),
    hazmatCertified: Yup.boolean().optional(),
  });

export const getEditDriverValidationSchema = (dict: Dictionary) =>
  Yup.object({
    phone: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.phoneNumber,
      })
    ),
    licenseNumber: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.licenseNumber,
      })
    ),
    licenseType: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.drivers?.fields?.licenseType || "License Type" })
    ),
    licenseExpiry: Yup.date()
      .nullable()
      .required(
        formatMessage(dict.validation.required, { field: dict.drivers?.fields?.licenseExpiry || "License Expiry" })
      ),
    employeeId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.drivers?.fields?.employeeId || "Employee ID" })
    ),
    status: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.status,
      })
    ),
    homeWareHouseId: Yup.string().optional(),
    currentVehicleId: Yup.string().optional(),
    languages: Yup.array().of(Yup.string()).optional(),
    hazmatCertified: Yup.boolean().optional(),
  });

/* --------------------------- Inventory Validation --------------------------- */
export const getAddInventoryValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    warehouseId: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.inventory.fields.warehouse,
      })
    ),
    sku: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.inventory.fields.sku,
        })
      )
      .min(
        3,
        formatMessage(dict.validation.min, {
          field: dict.inventory.fields.sku,
          min: 3,
        })
      ),
    name: Yup.string()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.inventory.fields.name,
        })
      )
      .min(
        2,
        formatMessage(dict.validation.min, {
          field: dict.inventory.fields.name,
          min: 2,
        })
      ),
    quantity: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.inventory.fields.quantity,
        })
      )
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.inventory.fields.quantity,
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.inventory.fields.quantity,
        })
      ),
    minStock: Yup.number()
      .required(
        formatMessage(dict.validation.required, {
          field: dict.inventory.fields.minStock,
        })
      )
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.inventory.fields.minStock,
        })
      )
      .integer(
        formatMessage(dict.validation.integer, {
          field: dict.inventory.fields.minStock,
        })
      ),
    unit: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.inventory?.fields?.unit || "Unit" })
    ),
    unitValue: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.inventory.fields.unitValue,
        })
      ),
    imageUrl: Yup.string().url(dict.validation.url).nullable().optional(),
    weightKg: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.inventory.fields.weight,
        })
      ),
    volumeM3: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.inventory.fields.volume,
        })
      ),
    palletCount: Yup.number()
      .nullable()
      .min(
        0,
        formatMessage(dict.validation.positive, {
          field: dict.inventory.fields.pallets,
        })
      ),
    cargoType: Yup.string().optional(),
  });

/* --------------------------- Shipment Validation --------------------------- */
export const getAddShipmentValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    trackingId: Yup.string().optional(),
    referenceNumber: Yup.string().optional(),
    priority: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.shipments?.fields?.priority || "Priority" }))
      .oneOf(
        ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        formatMessage(dict.validation.oneOf, { field: dict.shipments?.fields?.priority || "Priority" })
      ),
    type: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.shipments?.fields?.shipmentType || "Shipment Type" })
    ),
    slaDeadline: Yup.date()
      .nullable()
      .required(
        formatMessage(dict.validation.required, { field: dict.shipments?.fields?.slaDeadline || "SLA Deadline" })
      ),
    originWarehouseId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.shipments?.fields?.originWarehouse || "Origin Warehouse" })
    ),
    destination: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.shipments?.fields?.destination || "Destination" })
    ),
    customerId: Yup.string().optional(),
    customerLocationId: Yup.string().optional(),
    contactEmail: Yup.string()
      .email(dict.validation.email)
      .nullable()
      .optional(),
    palletCount: Yup.number()
      .required(
        formatMessage(dict.validation.required, { field: dict.shipments?.fields?.palletCount || "Pallet Count" })
      )
      .min(0)
      .integer(),
    weightKg: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: dict.shipments?.fields?.weight || "Weight" })),
    volumeM3: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: dict.shipments?.fields?.volume || "Volume" })),
  });

export const getEditShipmentValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    referenceNumber: Yup.string().optional(),
    priority: Yup.string()
      .optional()
      .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    type: Yup.string().optional(),
    slaDeadline: Yup.date().nullable().optional(),
    originWarehouseId: Yup.string().optional(),
    destination: Yup.string().optional(),
    customerId: Yup.string().optional(),
    customerLocationId: Yup.string().optional(),
    contactEmail: Yup.string()
      .email(dict.validation.email)
      .nullable()
      .optional(),
    palletCount: Yup.number().optional().min(0).integer(),
    weightKg: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: dict.shipments?.fields?.weight || "Weight" })),
    volumeM3: Yup.number()
      .nullable()
      .min(0, formatMessage(dict.validation.positive, { field: dict.shipments?.fields?.volume || "Volume" })),
  });

/* --------------------------- Route Validation --------------------------- */
export const getAddRouteValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    name: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.routes?.fields?.name || "Name" }))
      .min(3, formatMessage(dict.validation.min, { field: dict.routes?.fields?.name || "Name", min: 3 })),
    startTime: Yup.date()
      .nullable()
      .required(
        formatMessage(dict.validation.required, { field: dict.routes?.fields?.startTime || "Start Time" })
      ),
    endTime: Yup.date()
      .nullable()
      .required(formatMessage(dict.validation.required, { field: dict.routes?.fields?.endTime || "End Time" }))
      .min(Yup.ref("startTime"), dict.validation?.endTimeAfterStart || "End time must be after start time"),
    startAddress: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.routes?.fields?.startAddress || "Start Address" })
    ),
    endAddress: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.routes?.fields?.endAddress || "End Address" })
    ),
    driverId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.routes?.fields?.driver || "Driver" })
    ),
    vehicleId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.routes?.fields?.vehicle || "Vehicle" })
    ),
    stops: Yup.array().of(
      Yup.object().shape({
        address: Yup.string().required(formatMessage(dict.validation.required, { field: dict.routes?.fields?.address || "Address" })),
        lat: Yup.number().required(),
        lng: Yup.number().required(),
      })
    ).optional(),
  });

export const getEditRouteValidationSchema = (dict: Dictionary) =>
  getAddRouteValidationSchema(dict);

/* --------------------------- Warehouse Validation --------------------------- */
export const getAddWarehouseValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    name: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.routes?.fields?.name || "Name" }))
      .min(3, formatMessage(dict.validation.min, { field: dict.routes?.fields?.name || "Name", min: 3 })),
    code: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.code || "Code" }))
      .min(3, formatMessage(dict.validation.min, { field: dict.warehouses?.fields?.code || "Code", min: 3 })),
    type: Yup.string()
      .required(formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.type || "Type" }))
      .oneOf(
        ["DISTRIBUTION_CENTER", "CROSSDOCK", "WAREHOUSE"],
        formatMessage(dict.validation.oneOf, { field: dict.warehouses?.fields?.type || "Type" })
      ),
    timezone: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.timezone || "Timezone" })
    ),
    address: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.address || "Address" })
    ),
    city: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.city || "City" })
    ),
    country: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.country || "Country" })
    ),
    capacityPallets: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.capacity || "Capacity" }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.warehouses?.fields?.capacity || "Capacity" }))
      .integer(formatMessage(dict.validation.integer, { field: dict.warehouses?.fields?.capacity || "Capacity" })),
    capacityVolumeM3: Yup.number()
      .required(formatMessage(dict.validation.required, { field: dict.shipments?.fields?.volume || "Volume" }))
      .min(0, formatMessage(dict.validation.positive, { field: dict.shipments?.fields?.volume || "Volume" }))
      .integer(formatMessage(dict.validation.integer, { field: dict.shipments?.fields?.volume || "Volume" })),
  });

/* --------------------------- Issue Validation --------------------------- */
export const getVehicleReportIssueValidationSchema = (dict: Dictionary) =>
  Yup.object({
    title: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.vehicles.dialogs.issueTitle,
      })
    ),
    priority: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.vehicles.dialogs.priorityLevel,
      })
    ),
    description: Yup.string()
      .min(
        10,
        formatMessage(dict.validation.min, {
          field: dict.vehicles.dialogs.details,
          min: 10,
        })
      )
      .required(
        formatMessage(dict.validation.required, {
          field: dict.vehicles.dialogs.details,
        })
      ),
  });

/* --------------------------- Company Validation --------------------------- */
export const getCreateCompanyValidationSchema = (dict: Dictionary) =>
  Yup.object({
    name: Yup.string()
      .min(
        2,
        formatMessage(dict.validation.min, { field: dict.customers?.fields?.companyName || "Company Name", min: 2 })
      )
      .required(
        formatMessage(dict.validation.required, { field: dict.customers?.fields?.companyName || "Company Name" })
      ),
    industry: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.industry || "Industry" })
    ),
    timezone: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.timezone || "Timezone" })
    ),
    currency: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.currency || "Currency" })
    ),
  });

export const getAddCompanyMemberValidationSchema = (dict: Dictionary) =>
  Yup.object({
    email: Yup.string()
      .email(dict.validation.email)
      .required(
        formatMessage(dict.validation.required, { field: dict.auth.email })
      ),
    role: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.role || "Role" })
    ),
    firstName: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.firstName || "First Name" })
    ),
    lastName: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.lastName || "Last Name" })
    ),
  });

export const getAddCompanyMemberDriverValidationSchema = (dict: Dictionary) =>
  Yup.object({
    employeeId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.drivers?.fields?.employeeId || "Employee ID" })
    ),
    phone: Yup.string().required(
      formatMessage(dict.validation.required, {
        field: dict.drivers.fields.phoneNumber,
      })
    ),
    licenseNumber: Yup.string().optional(),
    licenseType: Yup.string().optional(),
    licenseExpiry: Yup.string().nullable().optional(),
  });

export const getEditCompanyMemberValidationSchema = (dict: Dictionary) =>
  Yup.object({
    name: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.firstName || "First Name" })
    ),
    surname: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.lastName || "Last Name" })
    ),
    roleId: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.role || "Role" })
    ),
    status: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.status || "Status" })
    ),
  });

/* --------------------------- Customer Validation --------------------------- */
export const getAddCustomerValidationSchema = (dict: Dictionary) =>
  Yup.object().shape({
    name: Yup.string()
      .required(
        formatMessage(dict.validation.required, { field: dict.customers?.fields?.companyName || "Company Name" })
      )
      .min(
        2,
        formatMessage(dict.validation.min, { field: dict.customers?.fields?.companyName || "Company Name", min: 2 })
      ),
    code: Yup.string()
      .optional()
      .min(2, formatMessage(dict.validation.min, { field: dict.warehouses?.fields?.code || "Code", min: 2 })),
    industry: Yup.string().required(
      formatMessage(dict.validation.required, { field: dict.customers?.fields?.industry || "Industry" })
    ),
    taxId: Yup.string().optional(),
    email: Yup.string().email(dict.validation.email).optional(),
    phone: Yup.string().optional(),
    locations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(
          formatMessage(dict.validation.required, { field: dict.customers?.fields?.locationName || "Location Name" })
        ),
        address: Yup.string().required(
          formatMessage(dict.validation.required, { field: dict.warehouses?.fields?.address || "Address" })
        ),
        lat: Yup.number().optional(),
        lng: Yup.number().optional(),
        isDefault: Yup.boolean().optional(),
      })
    ),
  });

export const getEditCustomerValidationSchema = (dict: Dictionary) =>
  getAddCustomerValidationSchema(dict);

/* --------------------------- Remaining Schemas (Temporary Backwards Compatibility) --------------------------- */
// These will be fully migrated as components are updated.
export const loginValidationSchema = (dict: Dictionary) =>
  getLoginValidationSchema(dict);
export const signUpValidationSchema = (dict: Dictionary) =>
  getSignUpValidationSchema(dict);
export const addVehicleValidationSchema = (dict: Dictionary) =>
  getAddVehicleValidationSchema(dict);
export const editVehicleValidationSchema = (dict: Dictionary) =>
  getEditVehicleValidationSchema(dict);
export const addDriverValidationSchema = (dict: Dictionary) =>
  getAddDriverValidationSchema(dict);
export const editDriverValidationSchema = (dict: Dictionary) =>
  getEditDriverValidationSchema(dict);
export const addInventoryValidationSchema = (dict: Dictionary) =>
  getAddInventoryValidationSchema(dict);
export const addShipmentValidationSchema = (dict: Dictionary) =>
  getAddShipmentValidationSchema(dict);
export const editShipmentValidationSchema = (dict: Dictionary) =>
  getEditShipmentValidationSchema(dict);
export const addRouteValidationSchema = (dict: Dictionary) =>
  getAddRouteValidationSchema(dict);
export const editRouteValidationSchema = (dict: Dictionary) =>
  getEditRouteValidationSchema(dict);
export const addWarehouseValidationSchema = (dict: Dictionary) =>
  getAddWarehouseValidationSchema(dict);
export const vehicleReportIssueValidationSchema = (dict: Dictionary) =>
  getVehicleReportIssueValidationSchema(dict);
export const createCompanyValidationSchema = (dict: Dictionary) =>
  getCreateCompanyValidationSchema(dict);
export const addCompanyMemberValidationSchema = (dict: Dictionary) =>
  getAddCompanyMemberValidationSchema(dict);
export const addCompanyMemberDriverValidationSchema = (dict: Dictionary) =>
  getAddCompanyMemberDriverValidationSchema(dict);
export const editCompanyMemberValidationSchema = (dict: Dictionary) =>
  getEditCompanyMemberValidationSchema(dict);
export const addCustomerValidationSchema = (dict: Dictionary) =>
  getAddCustomerValidationSchema(dict);
export const editCustomerValidationSchema = (dict: Dictionary) =>
  getEditCustomerValidationSchema(dict);
