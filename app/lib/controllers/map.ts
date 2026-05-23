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
    const companyId = user?.companyId || "";

    await checkPermission(user, companyId, ["role_admin", "role_manager"]);
    if (!origin || !destination) return null;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Missing Google Maps API Key");
      return null;
    }

    if (!process.env.GOOGLE_MAPS_API_KEY && process.env.NODE_ENV === "production") {
      console.warn("Security Warning: GOOGLE_MAPS_API_KEY is not defined. Falling back to client-exposed NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for server-side Directions API.");
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
