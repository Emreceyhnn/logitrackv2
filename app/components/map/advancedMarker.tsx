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

  const offsetPosition = useMemo(
    () => ({
      lat: position.lat + index * OFFSET,
      lng: position.lng,
    }),
    [position.lat, position.lng, index]
  );

  useEffect(() => {
    if (!contentRef.current) return;

    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: offsetPosition,
      content: contentRef.current,
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.position = offsetPosition;
  }, [offsetPosition]);

  return <div ref={contentRef}>{children}</div>;
}
