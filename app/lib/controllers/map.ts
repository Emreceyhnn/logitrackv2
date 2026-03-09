"use server";

import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";

export type DirectionPoint = string | { lat: number; lng: number };

export const getDirections = authenticatedAction(
  async (
    user,
    origin: DirectionPoint,
    destination: DirectionPoint,
    waypoints: {
      location: DirectionPoint;
      stopover: boolean;
    }[] = []
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";

    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
    if (!origin || !destination) return null;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
      return null;
    }

    const formatPoint = (p: string | { lat: number; lng: number }) => {
      if (typeof p === "string") return encodeURIComponent(p);
      return `${p.lat},${p.lng}`;
    };

    const originStr = formatPoint(origin);
    const destStr = formatPoint(destination);

    let waypointsStr = "";
    if (waypoints.length > 0) {
      const points = waypoints.map((w) => formatPoint(w.location)).join("|");
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
