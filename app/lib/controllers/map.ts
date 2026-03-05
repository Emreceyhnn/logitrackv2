"use server";

import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";

export const getDirections = authenticatedAction(
  async (
    user,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints: {
      location: { lat: number; lng: number };
      stopover: boolean;
    }[] = []
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";

    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
    if (!origin || !destination) return null;

    const apiKey = process.env.NEXT_PUBLIC_DIRECTIONS_API_KEY;
    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_DIRECTIONS_API_KEY");
      return null;
    }

    const originStr = `${origin.lat},${origin.lng}`;
    const destStr = `${destination.lat},${destination.lng}`;

    let waypointsStr = "";
    if (waypoints.length > 0) {
      const points = waypoints
        .map((w) => `${w.location.lat},${w.location.lng}`)
        .join("|");
      waypointsStr = `&waypoints=${points}`;
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}${waypointsStr}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Directions API error: ${res.statusText}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch directions", error);
      return null;
    }
  }
);
