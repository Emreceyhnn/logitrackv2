import * as Yup from "yup";
import { Dictionary, formatMessage } from "../language/language";

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
