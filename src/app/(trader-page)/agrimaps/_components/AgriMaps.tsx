"use client"
import React, { useCallback, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const initialCenter = {
    lat: 14.715310577164843,
    lng: 121.03522441433974
};

const coordinates = [
    { lat: 14.715310577164843, lng: 121.03522441433974, name: "Sharon Farm" },
    { lat: 14.731483158808185, lng: 121.0620389676612, name: "Villa Viena Urban Farm" },
    { lat: 14.709614652698521, lng: 121.04723620103312, name: "Urban Farm of Calderon" },
    { lat: 14.735558467177205, lng: 121.03526207751709, name: "Solo Parent Urban Farming" },
    { lat: 14.700575329668167, lng: 121.03357004390666, name: "Center for Urban Agriculture and Innovation (QCU)" },
    { lat: 14.69261616209439, lng: 121.0752362291887, name: "Gulayan at Bulaklakan Urban Farm" },
    { lat: 14.689517343159308, lng: 121.05601712073572, name: "SunnyVille Urban Farm" },
    { lat: 14.658201721231105, lng: 121.0552264935998, name: "Green Thumb Arbo Urban Farm (GrowQC)" },
    { lat: 14.648421426484312, lng: 121.05098021719552, name: "Joy of Urban Farming" },
    { lat: 14.652738473934496, lng: 121.05672069016371, name: "San Vicente Urban Farming" },

];

export const AgriMaps = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    })

    const [map, setMap] = useState(null)
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    const onLoad = useCallback(function callback(map: any) {
        // const bounds = new window.google.maps.LatLngBounds(center);
        // map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    // const handleMarkerClick = (marker: any) => {
    //     setSelectedMarker(marker);
    // };

    const handleSearch = () => {
        const location = coordinates.find(coord => coord.name.toLowerCase() === searchQuery.toLowerCase());
        if (location) {
            setSelectedMarker(location as any);
            setError('');
        } else {
            setSelectedMarker(null);
            setError('No match found for the location.');
        }
    };

    return isLoaded ? (
        <div className='space-y-3 mt-11 md:mt-0'>
            <div className='flex gap-3'>
                <Input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className={`${error.length > 1 ? "border-rose-500 placeholder:text-rose-500" : ""}`}
                />
                <Button onClick={handleSearch} variant="primary">Search</Button>
            </div>
            {error && <p className="text-rose-500">{error}</p>}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedMarker ? selectedMarker : initialCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {coordinates.map((coordinate, index) => (
                    <Marker
                        key={index}
                        position={coordinate}
                        onClick={() => setSelectedMarker(coordinate as any)}
                    >
                        {selectedMarker === coordinate && (
                            <InfoWindow
                                position={coordinate}
                                onCloseClick={() => setSelectedMarker(null)}
                            >
                                <div>
                                    <h3>{
                                        //@ts-ignore
                                        coordinate.name}</h3>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
            </GoogleMap>
        </div>
    ) : <></>
}
