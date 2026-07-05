import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Person3Icon from "@mui/icons-material/Person3";

interface Markers {
  id: string;
  type: string;
  lat: number;
  len: number;
  name: string;
}

/** Escape a value before interpolating it into a raw HTML attribute string. */
function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface MapWithMarkerProps {
  markers: Markers[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: Markers) => void;
}

function MapBoundsFit({
  markers,
  center,
  zoom,
}: {
  markers: Markers[];
  center?: [number, number];
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    // 1. Fix Leaflet's "White Space" bug when container size changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const container = map.getContainer();
    if (container) {
      resizeObserver.observe(container);
    }

    // Fallback invalidateSize for immediate hydration
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // 2. Calculate dynamic bounds from markers if available
    let bounds: L.LatLngBounds | null = null;
    if (markers && markers.length > 0) {
      bounds = L.latLngBounds(markers.map((m) => [m.lat, m.len]));
    }

    // 3. Apply Camera Logic (Hybrid Approach)
    if (!bounds || !bounds.isValid()) {
      // No valid markers: just use explicit props if they exist
      if (center) map.setView(center, zoom ?? map.getZoom());
      else if (zoom !== undefined) map.setZoom(zoom);
    } else {
      // Valid markers exist: mix explicit props with dynamic calculations
      if (center && zoom !== undefined) {
        // Both explicit: Fully override dynamic calculation
        map.setView(center, zoom);
      } else if (center && zoom === undefined) {
        // Explicit center, Dynamic zoom
        const dynamicZoom = map.getBoundsZoom(bounds);
        map.setView(center, Math.min(dynamicZoom, 15));
      } else if (!center && zoom !== undefined) {
        // Dynamic center, Explicit zoom
        const dynamicCenter = bounds.getCenter();
        map.setView(dynamicCenter, zoom);
      } else {
        // Both dynamic: Let Leaflet perfectly fit the bounds
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [map, markers, center, zoom]);

  return null;
}

function MapWithMarkers({ markers, center, zoom, onMarkerClick }: MapWithMarkerProps) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center || [39.9208, 32.8541]}
        zoom={zoom || 6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapBoundsFit markers={markers} center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {markers.map((marker, index) => {
          let iconColor = "#3b82f6";
          let iconHtml = "";

          if (marker.type === "V") {
            iconColor = "#3b82f6";
            iconHtml = renderToString(
              <LocalShippingIcon
                style={{
                  width: "32px",
                  height: "32px",
                  color: iconColor,
                  fill: "currentColor",
                }}
              />
            );
          } else if (marker.type === "W") {
            iconColor = "#10b981";
            iconHtml = renderToString(
              <WarehouseIcon
                style={{
                  width: "32px",
                  height: "32px",
                  color: iconColor,
                  fill: "currentColor",
                }}
              />
            );
          } else if (marker.type === "C") {
            iconColor = "#f59e0b";
            iconHtml = renderToString(
              <Person3Icon
                style={{
                  width: "32px",
                  height: "32px",
                  color: iconColor,
                  fill: "currentColor",
                }}
              />
            );
          }

          return (
            <Marker
              key={index}
              position={[marker.lat, marker.len]}
              // Leaflet renders each marker as a keyboard-focusable role="button";
              // `title` + the aria-label on the html root give it an accessible
              // name so screen-reader / keyboard users aren't tabbing through
              // dozens of nameless "button"s.
              title={marker.name}
              alt={marker.name}
              icon={L.divIcon({
                html: `
                  <div role="img" aria-label="${escapeHtmlAttr(marker.name)}" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; color: ${iconColor}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                    ${iconHtml}
                  </div>
                `,
                className: "custom-marker",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })}
              eventHandlers={{ click: () => onMarkerClick?.(marker) }}
            >
              <Popup>
                <div>
                  <Typography variant="h6">{marker.name}</Typography>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
}

export default MapWithMarkers;
