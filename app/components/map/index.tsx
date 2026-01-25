"use client"

import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { DirectionsRenderer, GoogleMap, useJsApiLoader } from "@react-google-maps/api"
import { AdvancedMarker } from "./advancedMarker"
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import { Stack, Typography } from "@mui/material";

type LatLng = { lat: number; lng: number }

type LocationItem = {
    id: string | number
    name: string
    position: LatLng
    type: string;
}

interface GoogleMapViewProps {
    isRoute?: boolean
    locA?: LatLng
    locB?: LatLng
    warehouseLoc?: LocationItem[]
    zoom?: number
}

const containerStyle = { width: "100%", height: "100%" }

const GoogleMapView = ({
    isRoute = false,
    locA,
    locB,
    warehouseLoc = [],
    zoom = 12,
}: GoogleMapViewProps) => {

    /* --------------------------------- states --------------------------------- */
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const MAP_LIBRARIES = process.env.NEXT_PUBLIC_GOOGLE_MAPS_LIBRARIES
        ?.split(",") as ("marker")[]


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: MAP_LIBRARIES,
    })

    const mapCenter: LatLng = useMemo(() => {
        return locA ?? warehouseLoc?.[0]?.position ?? { lat: 40.195, lng: 29.060 }
    }, [locA, warehouseLoc])


    /* --------------------------------- handler -------------------------------- */
    const handleLoad = useCallback(
        (mapInstance: google.maps.Map) => {
            setMap(mapInstance)
            mapInstance.panTo(mapCenter) // sadece ilk yüklemede
        },
        [mapCenter]
    )


    /* -------------------------------- lifecycle ------------------------------- */
    useEffect(() => {
        if (!isLoaded) return
        if (!isRoute) return
        if (!locA || !locB) return

        const service = new google.maps.DirectionsService()
        service.route(
            {
                origin: locA,
                destination: locB,
                travelMode: google.maps.TravelMode.DRIVING,
                drivingOptions: {
                    departureTime: new Date(),
                    trafficModel: google.maps.TrafficModel.BEST_GUESS,
                },
            },
            (result, status) => {
                if (status === "OK" && result) setDirections(result)
            }
        )
    }, [isLoaded, isRoute, locA, locB])


    if (!isLoaded) return null


    /* ------------------------------- components ------------------------------- */
    const IconSetter = (type: string) => {

        if (type === "W") {
            return (<WarehouseIcon sx={{ color: "orange", fontSize: 30 }} />)
        }
        else if (type === "V") {
            return (<DirectionsCarIcon sx={{ color: "blue", fontSize: 30 }} />)
        }
        else {
            return (<PersonIcon sx={{ color: "blue", fontSize: 30 }} />)
        }
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={handleLoad}
            zoom={zoom}
            options={{
                mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID!,


            }}
        >

            {map &&
                warehouseLoc.map((w, index) => (
                    <AdvancedMarker key={w.id} map={map} position={w.position} index={index}>
                        <Stack alignItems={"center"}>
                            {IconSetter(w.type)}
                            <Typography sx={{ fontSize: 14, color: "black" }}>{w.name}</Typography>
                        </Stack>
                    </AdvancedMarker>
                ))}

            {isRoute && directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: true,
                        preserveViewport: true,
                    }}
                />
            )}
        </GoogleMap>
    )
}

export default memo(GoogleMapView)
