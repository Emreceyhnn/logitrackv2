"use client";

import { useEffect, useMemo, useRef } from "react";

type AdvancedMarkerProps = {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  index: number;
  children: React.ReactNode;
};

const OFFSET = 0.00003;

export function AdvancedMarker({
  map,
  position,
  index,
  children,
}: AdvancedMarkerProps) {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const contentRef = useRef<HTMLDivElement | null>(null);

  const offsetPosition = useMemo(() => {
    if (
      !position ||
      typeof position.lat !== "number" ||
      typeof position.lng !== "number" ||
      isNaN(position.lat) ||
      isNaN(position.lng)
    ) {
      return null;
    }
    return {
      lat: position.lat + index * OFFSET,
      lng: position.lng,
    };
  }, [position.lat, position.lng, index]);

  useEffect(() => {
    if (!contentRef.current) return;

    if (!markerRef.current) {
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        content: contentRef.current,
      });
    }

    // Update properties
    if (markerRef.current) {
      if (offsetPosition) {
        markerRef.current.position = offsetPosition;
        markerRef.current.map = map;
      } else {
        markerRef.current.map = null;
      }
    }

    return () => {
      // Cleanup is tricky if we want to reuse the same marker instance across renders if map doesn't change
      // But typically we should cleanup if component unmounts.
      // The dependency array [map, offsetPosition] means we update whenever these change.
      // If we strictly want creation ONCE, we should separate creation.
    };
  }, [map, offsetPosition]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, []);

  return <div ref={contentRef}>{children}</div>;
}
