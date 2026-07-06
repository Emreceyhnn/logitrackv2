import * as Yup from "yup";
import { Dictionary, formatMessage } from "../language/language";

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
