import { ShipmentStatus } from "@prisma/client";
// The transition map is defined in a client-safe module (plain-object enum, no
// Prisma runtime) so server and UI share one source of truth. Prisma's enum is
// structurally identical to the const-object enum, so the map types line up.
import {
  SHIPMENT_TRANSITIONS as SHARED_TRANSITIONS,
  canTransitionShipment as sharedCanTransition,
} from "../../type/shipmentTransitions";

export {
  SHIPMENT_TRANSITIONS,
  TERMINAL_SHIPMENT_STATUSES,
  isTerminalShipmentStatus,
  canTransitionShipment,
} from "../../type/shipmentTransitions";

/** Throws when the requested status change is not a legal lifecycle move. */
export function assertShipmentTransition(
  from: ShipmentStatus,
  to: ShipmentStatus
): void {
  if (!sharedCanTransition(from, to)) {
    throw new Error(
      `Invalid shipment status transition: ${from} -> ${to}. Allowed from ${from}: ${
        SHARED_TRANSITIONS[from]?.join(", ") || "none (terminal status)"
      }`
    );
  }
}
