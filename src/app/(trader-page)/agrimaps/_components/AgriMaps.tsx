"use client"
import React, { useCallback, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 14.715310577164843,
    lng: 121.03522441433974
};

const coordinates = [
    { lat: 14.715310577164843, lng: 121.03522441433974, name: "Sharon Farm" },
    { lat: 14.731483158808185, lng: 121.0620389676612, name: "Villa Viena Urban Farm" },
    { lat: 14.709614652698521, lng: 121.04723620103312, name: "Urban Farm of Calderon" },
    { lat: 14.735558467177205, lng: 121.03526207751709, name: "Solo Parent Urban Farming" },
    // Add more coordinates here...
];

export const AgriMaps = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    })

    const [map, setMap] = useState(null)
    const [selectedMarker, setSelectedMarker] = useState(null);

    const onLoad = useCallback(function callback(map: any) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    const handleMarkerClick = (marker: any) => {
        setSelectedMarker(marker);
    };

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {coordinates.map((coordinate, index) => (
                <Marker
                    key={index}
                    position={coordinate}
                    onClick={() => handleMarkerClick(coordinate)}
                >
                    {selectedMarker === coordinate && (
                        <InfoWindow
                            position={coordinate}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div>
                                <h3>{
                                    // @ts-ignore
                                    coordinate.name}</h3>
                                {/* You can add additional information here if needed */}
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            ))}
        </GoogleMap>
    ) : <></>
}
