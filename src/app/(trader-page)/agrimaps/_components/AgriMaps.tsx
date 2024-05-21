"use client"

import {
    Card,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from "@tanstack/react-query";
import { MapPin, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { fetchAgrimaps, fetchUserSideAgrimaps } from "../../../../../actions/agrimaps";
import { Loading } from "@/components/Loading";
import { Coordinates } from "@prisma/client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const containerStyle = {
    width: '100%',
    height: '400px'
};

const initialCenter = {
    lat: 14.715310577164843,
    lng: 121.03522441433974
};

const mapCoordinateToLatLngLiteral = (coordinate: Coordinates) => {
    return {
        lat: coordinate.lat,
        lng: coordinate.lang
    };
};

interface Props {
    coordinates: Coordinates[]
}

export const AgriMaps = (
    // { coordinates }: Props
) => {
    const [district, setDistrict] = useState("")
    const [barangay, setBarangay] = useState("")

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    })

    const [map, setMap] = useState(null)
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [error, setError] = useState('');

    const onLoad = useCallback(function callback(map: any) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    const { data: coordinates, refetch } = useQuery({
        queryKey: ["fetch-coordinates"],
        queryFn: () => fetchUserSideAgrimaps(barangay)
    })

    useEffect(() => {
        refetch()
    }, [barangay, district])


    return isLoaded ? (
        <div className='space-y-3 mt-11 md:mt-0'>




            {error && <p className="text-rose-500">{error}</p>}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedMarker ? selectedMarker : initialCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {coordinates?.map((coordinate, index) => (
                    <Marker
                        key={index}
                        position={mapCoordinateToLatLngLiteral(coordinate)}
                        onClick={() => setSelectedMarker(coordinate as any)}
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
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
            </GoogleMap>

            <div className="w-full flex justify-between">
                <h1 className="text-lg font-medium">
                    Agrimaps filter
                </h1>

                <p className="text-lg font-medium text-rose-500 flex items-center cursor-pointer" onClick={() => {
                    setDistrict("")
                    setBarangay("")
                }}>
                    {barangay && (<><X className="mr-2 w-5 h-5" />Reset filter</>)}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3">
                <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="">
                        <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Districts</SelectLabel>
                            <>
                                <SelectItem value="District 1">District 1</SelectItem>
                                <SelectItem value="District 2">District 2</SelectItem>
                                <SelectItem value="District 3">District 3</SelectItem>
                                <SelectItem value="District 4">District 4</SelectItem>
                                <SelectItem value="District 5">District 5</SelectItem>
                                <SelectItem value="District 6">District 6</SelectItem>
                            </>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={barangay} onValueChange={setBarangay}>
                    <SelectTrigger className="">
                        <SelectValue placeholder="Select a barangay" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Barangay</SelectLabel>
                            <>
                                {district === "District 1" && (
                                    <>
                                        <SelectItem value="Alicia">Alicia</SelectItem>
                                        <SelectItem value="Bago Bantay">Bago Bantay</SelectItem>
                                        <SelectItem value="Bagong Pag-asa">Bagong Pag-asa</SelectItem>
                                        <SelectItem value="Bahay Toro">Bahay Toro</SelectItem>
                                        <SelectItem value="Balingasa">Balingasa</SelectItem>
                                        <SelectItem value="Bungad">Bungad</SelectItem>
                                        <SelectItem value="Damar">Damar</SelectItem>
                                        <SelectItem value="Damayan">Damayan</SelectItem>
                                        <SelectItem value="Del Monte">Del Monte</SelectItem>
                                        <SelectItem value="Katipunan">Katipunan</SelectItem>
                                        <SelectItem value="Lourdes">Lourdes</SelectItem>
                                        <SelectItem value="Maharlika">Maharlika</SelectItem>
                                        <SelectItem value="Manresa">Manresa</SelectItem>
                                        <SelectItem value="Mariblo">Mariblo</SelectItem>
                                        <SelectItem value="Masambong">Masambong</SelectItem>
                                        <SelectItem value="N.S. Amoranto (Gintong Silahis)">N.S. Amoranto (Gintong Silahis)</SelectItem>
                                        <SelectItem value="Nayong Kanluran">Nayong Kanluran</SelectItem>
                                        <SelectItem value="Paang Bundok">Paang Bundok</SelectItem>
                                        <SelectItem value="Pag-ibig sa Nayon">Pag-ibig sa Nayon</SelectItem>
                                        <SelectItem value="Paltok">Paltok</SelectItem>
                                        <SelectItem value="Paraiso">Paraiso</SelectItem>
                                        <SelectItem value="Phil-Am">Phil-Am</SelectItem>
                                        <SelectItem value="Project 6">Project 6</SelectItem>
                                        <SelectItem value="Ramon Magsaysay">Ramon Magsaysay</SelectItem>
                                        <SelectItem value="Saint Peter">Saint Peter</SelectItem>
                                        <SelectItem value="Salvacion">Salvacion</SelectItem>
                                        <SelectItem value="San Antonio">San Antonio</SelectItem>
                                        <SelectItem value="San Isidro Labrador">San Isidro Labrador</SelectItem>
                                        <SelectItem value="San Jose">San Jose</SelectItem>
                                        <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                                        <SelectItem value="Santa Teresita">Santa Teresita</SelectItem>
                                        <SelectItem value="Sto. Cristo">Sto. Cristo</SelectItem>
                                        <SelectItem value="Santo Domingo">Santo Domingo</SelectItem>
                                        <SelectItem value="Siena">Siena</SelectItem>
                                        <SelectItem value="Talayan">Talayan</SelectItem>
                                        <SelectItem value="Vasra">Vasra</SelectItem>
                                        <SelectItem value="Veterans Village">Veterans Village</SelectItem>
                                        <SelectItem value="West Triangle">West Triangle</SelectItem>
                                    </>
                                )}
                                {district === "District 2" && (
                                    <>
                                        <SelectItem value="Bagong Silangan">Bagong Silangan</SelectItem>
                                        <SelectItem value="Batasan Hills">Batasan Hills</SelectItem>
                                        <SelectItem value="Commonwealth">Commonwealth</SelectItem>
                                        <SelectItem value="Holy Spirit">Holy Spirit</SelectItem>
                                        <SelectItem value="Payatas (Litex)">Payatas (Litex)</SelectItem>
                                    </>
                                )}
                                {district === "District 3" && (
                                    <>
                                        <SelectItem value="Amihan">Amihan</SelectItem>
                                        <SelectItem value="Bagumbayan">Bagumbayan</SelectItem>
                                        <SelectItem value="Bagumbuhay">Bagumbuhay</SelectItem>
                                        <SelectItem value="Bayanihan">Bayanihan</SelectItem>
                                        <SelectItem value="Blue Ridge A">Blue Ridge A</SelectItem>
                                        <SelectItem value="Blue Ridge B">Blue Ridge B</SelectItem>
                                        <SelectItem value="Camp Aguinaldo">Camp Aguinaldo</SelectItem>
                                        <SelectItem value="Claro (Quirino 3-B)">Claro (Quirino 3-B)</SelectItem>
                                        <SelectItem value="Dioquino Zobel">Dioquino Zobel</SelectItem>
                                        <SelectItem value="Duyan-duyan">Duyan-duyan</SelectItem>
                                        <SelectItem value="E. Rodriguez">E. Rodriguez</SelectItem>
                                        <SelectItem value="East Kamias">East Kamias</SelectItem>
                                        <SelectItem value="Escopa I">Escopa I</SelectItem>
                                        <SelectItem value="Escopa II">Escopa II</SelectItem>
                                        <SelectItem value="Escopa III">Escopa III</SelectItem>
                                        <SelectItem value="Escopa IV">Escopa IV</SelectItem>
                                        <SelectItem value="Libis">Libis</SelectItem>
                                        <SelectItem value="Loyola Heights">Loyola Heights</SelectItem>
                                        <SelectItem value="Mangga">Mangga</SelectItem>
                                        <SelectItem value="Marilag">Marilag</SelectItem>
                                        <SelectItem value="Masagana">Masagana</SelectItem>
                                        <SelectItem value="Matandang Balara">Matandang Balara</SelectItem>
                                        <SelectItem value="Old Balara">Old Balara</SelectItem>
                                        <SelectItem value="Milagrosa">Milagrosa</SelectItem>
                                        <SelectItem value="Pansol">Pansol</SelectItem>
                                        <SelectItem value="Quirino 2-A">Quirino 2-A</SelectItem>
                                        <SelectItem value="Quirino 2-B">Quirino 2-B</SelectItem>
                                        <SelectItem value="Quirino 2-C">Quirino 2-C</SelectItem>
                                        <SelectItem value="Quirino 3-A">Quirino 3-A</SelectItem>
                                        <SelectItem value="St. Ignatius">St. Ignatius</SelectItem>
                                        <SelectItem value="San Roque">San Roque</SelectItem>
                                        <SelectItem value="Silangan">Silangan</SelectItem>
                                        <SelectItem value="Socorro">Socorro</SelectItem>
                                        <SelectItem value="Tagumpay">Tagumpay</SelectItem>
                                        <SelectItem value="Ugong Norte">Ugong Norte</SelectItem>
                                        <SelectItem value="Villa Maria Clara">Villa Maria Clara</SelectItem>
                                        <SelectItem value="West Kamias">West Kamias</SelectItem>
                                        <SelectItem value="White Plains">White Plains</SelectItem>
                                    </>
                                )}
                                {district === "District 4" && (
                                    <>
                                        <SelectItem value="Bagong Lipunan ng Crame">Bagong Lipunan ng Crame (Camp Crame)</SelectItem>
                                        <SelectItem value="Botocan">Botocan (Diliman - northern half)</SelectItem>
                                        <SelectItem value="Central">Central (Diliman)</SelectItem>
                                        <SelectItem value="Damayang Lagi">Damayang Lagi</SelectItem>
                                        <SelectItem value="Don Manuel">Don Manuel</SelectItem>
                                        <SelectItem value="Doña Aurora">Doña Aurora</SelectItem>
                                        <SelectItem value="Doña Imelda">Doña Imelda</SelectItem>
                                        <SelectItem value="Doña Josefa">Doña Josefa</SelectItem>
                                        <SelectItem value="Horseshoe">Horseshoe</SelectItem>
                                        <SelectItem value="Immaculate Concepciono">Immaculate Concepciono</SelectItem>
                                        <SelectItem value="Kalusugan">Kalusugan</SelectItem>
                                        <SelectItem value="Kamuning">Kamuning</SelectItem>
                                        <SelectItem value="Kaunlaran">Kaunlaran</SelectItem>
                                        <SelectItem value="Kristong Hari">Kristong Hari</SelectItem>
                                        <SelectItem value="Krus na Ligas">Krus na Ligas</SelectItem>
                                        <SelectItem value="Laging Handa">Laging Handa</SelectItem>
                                        <SelectItem value="Malaya">Malaya</SelectItem>
                                        <SelectItem value="Mariana">Mariana</SelectItem>
                                        <SelectItem value="Obrero">Obrero (Diliman - northern half)</SelectItem>
                                        <SelectItem value="Old Capitol Site">Old Capitol Site</SelectItem>
                                        <SelectItem value="Paligsahan">Paligsahan</SelectItem>
                                        <SelectItem value="Pinagkaisahan">Pinagkaisahan</SelectItem>
                                        <SelectItem value="Pinyahan">Pinyahan</SelectItem>
                                        <SelectItem value="Roxas">Roxas</SelectItem>
                                        <SelectItem value="Sacred Heart">Sacred Heart</SelectItem>
                                        <SelectItem value="San Isidro">San Isidro</SelectItem>
                                        <SelectItem value="San Martin de Porres">San Martin de Porres</SelectItem>
                                        <SelectItem value="San Vicente">San Vicente</SelectItem>
                                        <SelectItem value="Santol">Santol</SelectItem>
                                        <SelectItem value="Sikatuna Village">Sikatuna Village</SelectItem>
                                        <SelectItem value="South Triangle">South Triangle</SelectItem>
                                        <SelectItem value="Sto. Niño">Sto. Niño</SelectItem>
                                        <SelectItem value="Tatalon">Tatalon (Sanctuarium)</SelectItem>
                                        <SelectItem value="Teacher's Village East">Teacher's Village East (Diliman)</SelectItem>
                                        <SelectItem value="Teacher's Village West">Teacher's Village West (Diliman)</SelectItem>
                                        <SelectItem value="U.P. Campus">U.P. Campus</SelectItem>
                                        <SelectItem value="U.P. Village">U.P. Village</SelectItem>
                                        <SelectItem value="Valencia">Valencia</SelectItem>
                                    </>
                                )}
                                {district === "District 5" && (
                                    <>
                                        <SelectItem value="Bagbag">Bagbag</SelectItem>
                                        <SelectItem value="Capri">Capri</SelectItem>
                                        <SelectItem value="Fairview">Fairview</SelectItem>
                                        <SelectItem value="Gulod">Gulod</SelectItem>
                                        <SelectItem value="Greater Lagro">Greater Lagro</SelectItem>
                                        <SelectItem value="Kaligayahan">Kaligayahan</SelectItem>
                                        <SelectItem value="Nagkaisang Nayon">Nagkaisang Nayon</SelectItem>
                                        <SelectItem value="North Fairview">North Fairview</SelectItem>
                                        <SelectItem value="Novaliches Proper">Novaliches Proper</SelectItem>
                                        <SelectItem value="Pasong Putik Proper">Pasong Putik Proper</SelectItem>
                                        <SelectItem value="San Agustin">San Agustin</SelectItem>
                                        <SelectItem value="San Bartolome">San Bartolome</SelectItem>
                                        <SelectItem value="Sta. Lucia">Sta. Lucia</SelectItem>
                                        <SelectItem value="Sta. Monica">Sta. Monica</SelectItem>
                                    </>
                                )}
                                {district === "District 6" && (
                                    <>
                                        <SelectItem value="Apolonio Samson">Apolonio Samson</SelectItem>
                                        <SelectItem value="Baesa">Baesa</SelectItem>
                                        <SelectItem value="Balong Bato">Balong Bato</SelectItem>
                                        <SelectItem value="Culiat">Culiat</SelectItem>
                                        <SelectItem value="New Era">New Era</SelectItem>
                                        <SelectItem value="Sangandaan">Sangandaan</SelectItem>
                                        <SelectItem value="Sauyo">Sauyo</SelectItem>
                                        <SelectItem value="Talipapa">Talipapa</SelectItem>
                                        <SelectItem value="Tandang Sora">Tandang Sora</SelectItem>
                                        <SelectItem value="Unang Sigaw">Unang Sigaw</SelectItem>
                                    </>
                                )}
                            </>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-3 w-full pb-5'>
                {coordinates?.map((coordinate, index) => (
                    <Card className='w-full'>
                        <CardHeader>
                            <CardTitle
                                onClick={() => setSelectedMarker(coordinate as any)}
                                className='cursor-pointer flex flex-row justify-between gap-3 text-lg items-center w-full'
                            >
                                <div className='flex flex-row gap-2 truncate'>
                                    <MapPin />
                                    {coordinate.name}
                                </div>

                                <div>
                                    {
                                        //@ts-ignore
                                        coordinate._count?.donations
                                    }
                                </div>
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    ) : <></>
}
