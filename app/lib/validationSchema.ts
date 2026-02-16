import * as Yup from "yup";

export const addVehicleValidationSchema = Yup.object().shape({
  fleetNo: Yup.string()
    .required("Fleet number is required")
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

export const vehicleReportIssueValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  priority: Yup.string()
    .required("Priority is required")
    .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], "Invalid priority"),
  description: Yup.string(),
});

export const createCompanyValidationSchema = Yup.object({
  companyName: Yup.string()
    .min(2, "Name too short")
    .required("Company Name is required"),
  avatarUrl: Yup.string().url("Must be a valid URL").optional(),
});

export const createUserValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const registerValidationSchema = Yup.object({
  username: Yup.string().min(3).max(20).required("Username is required"),
  name: Yup.string().min(2).max(20).required("Name is required"),
  surname: Yup.string().min(2).max(20).required("Surname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[^a-zA-Z0-9]/, "Password must contain a special character")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Repeat password is required"),
});
