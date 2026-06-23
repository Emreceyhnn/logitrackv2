import { useMemo, useEffect } from "react";
import { Box } from "@mui/material";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";
import RoomIcon from "@mui/icons-material/Room";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface PolylinePoint {
  lat: number;
  lon: number;
  name: string;
}

interface MapWithPolylineProps {
  Polylines: PolylinePoint[];
  routePolyline?: [number, number][] | null;
  vehicleLocation?: {
    lat: number;
    lng: number;
    name: string;
  } | null;
}

// A helper component to adjust the map bounds
function MapBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

function MapWithPolyline({
  Polylines = [],
  routePolyline = null,
  vehicleLocation = null,
}: MapWithPolylineProps) {
  const polylinePositions: [number, number][] = useMemo(() => {
    if (!routePolyline) return [];
    return routePolyline.map((coord) => [coord[0], coord[1]]);
  }, [routePolyline]);

  const bounds = useMemo(() => {
    if (polylinePositions.length > 0) {
      return L.latLngBounds(polylinePositions);
    } else if (Polylines.length > 0) {
      return L.latLngBounds(
        Polylines.map((p) => [p.lat, p.lon] as [number, number])
      );
    }
    return null;
  }, [polylinePositions, Polylines]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[39.9208, 32.8541]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapBounds bounds={bounds} />

        {Polylines.map((marker, index) => {
          let iconColor = "#3b82f6"; // default fallback

          // Set colors: Start is Green, intermediate stops are Orange, Last is Red
          if (index === 0) {
            iconColor = "#10b981"; // green
          } else if (index === Polylines.length - 1) {
            iconColor = "#ef4444"; // red
          } else {
            iconColor = "#f59e0b"; // orange
          }

          let iconHtml = "";

          iconHtml = renderToString(
            <RoomIcon
              style={{
                width: "32px",
                height: "32px",
                color: iconColor,
                fill: "currentColor",
              }}
            />
          );

          return (
            <Marker
              key={index}
              position={[marker.lat, marker.lon]}
              icon={L.divIcon({
                html: `
                  <div style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; color: ${iconColor}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                    ${iconHtml}
                  </div>
                `,
                className: "custom-marker",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })}
            >
              <Popup>
                <div>
                  <h2>{marker.name}</h2>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {polylinePositions?.length > 0 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: "#3b82f6", // Vibrant primary blue
              weight: 5,
              opacity: 0.85,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {vehicleLocation && (
          <Marker
            position={[vehicleLocation.lat, vehicleLocation.lng]}
            icon={L.divIcon({
              html: `
                <div style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; color: #a855f7; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                  ${renderToString(<LocalShippingIcon style={{ width: "32px", height: "32px", color: "#a855f7" }} />)}
                </div>
              `,
              className: "custom-marker",
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })}
          >
            <Popup>
              <div>
                <h2>{vehicleLocation.name}</h2>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
}

export default MapWithPolyline;
