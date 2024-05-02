"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TraderSchema, TraderType } from "@/lib/validations/user-settings"
import { Separator } from "@/components/ui/separator"
import { User } from "@prisma/client"
import { Country, State, City } from "country-state-city"
import { useEffect, useState, useTransition } from "react"
import AddressSelector from "@/components/AddressSelector"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateSettings } from "../../../../../actions/address-settings"

type TraderAddressProps = {
    user: User
}

type StateType = {
    countryCode: string;
    isoCode: string;
    latitude: string;
    longitude: string;
    name: string;
}

type CityType = {
    stateCode: string;
    latitude: string;
    longitude: string;
    name: string;
    countryCode: string;
}

export const TraderAddress: React.FC<TraderAddressProps> = ({ user }) => {
    let countryData = Country.getAllCountries();
    // let currentStateData = State.getStateByCode("NCR")
    const [stateData, setStateData] = useState();
    const [cityData, setCityData] = useState();
    const [country, setCountry] = useState(countryData[173]);
    const [state, setState] = useState<StateType>();
    const [city, setCity] = useState<CityType>();
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [district, setDistrict] = useState("")
    const [barangay, setBarangay] = useState("")
    const [isPending, startTransition] = useTransition()

    const router = useRouter();

    useEffect(() => {
        //@ts-ignore
        setStateData(State.getStatesOfCountry(country?.isoCode));
    }, [country]);

    useEffect(() => {
        //@ts-ignore
        setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }, [state]);

    useEffect(() => {
        stateData && setState(stateData[59]);
    }, [stateData]);

    useEffect(() => {
        cityData && setCity(cityData[23]);
    }, [cityData]);

    const form = useForm<TraderType>({
        resolver: zodResolver(TraderSchema),
        defaultValues: {
            address: user?.address || "",
            companyName: user?.companyName || "",
            country: user?.country || "",
            state: user?.state || "",
            city: user?.city || "",
            zip: user?.zip || undefined,
            district: user?.district || "",
            brgy: user.brgy || "",
        },
    })

    // const { mutate: updateAddress, isLoading } = useMutation({
    //     mutationFn: async ({
    //         address,
    //         city,
    //         companyName,
    //         country,
    //         state,
    //         zip,
    //         district,
    //         brgy,
    //     }: TraderType) => {
    //         const payload: TraderType = {
    //             address,
    //             city,
    //             companyName,
    //             country,
    //             state,
    //             zip,
    //             district,
    //             brgy,
    //         }

    //         const { data } = await axios.put("/api/accountAddress", payload)
    //         return data
    //     },
    //     onError: (err) => {
    //         if (err instanceof AxiosError) {

    //         } else {
    //             return toast({
    //                 title: 'Something went wrong.',
    //                 description: "Error",
    //                 variant: 'destructive',
    //             })
    //         }
    //     },
    //     onSuccess: (data) => {
    //         toast({
    //             title: 'Success!',
    //             description: `${data}`,
    //             variant: 'default',
    //         })

    //         setTimeout(() => {
    //             window.location.reload(),
    //                 router.refresh()
    //         }, 1000)
    //     }
    // })

    function onSubmit(values: TraderType) {
        // const payload: TraderType = {
        //     address: values.address,
        //     zip: values.zip,
        //     companyName: values.companyName,
        //     country: country.name,
        //     state: state?.name,
        //     city: city?.name,
        //     district: district,
        //     brgy: barangay,
        // }

        // updateAddress(payload)
        startTransition(() => {
            updateSettings(values, barangay, district)
                .then((callback) => {
                    if (callback.error) {
                        toast({
                            description: callback.error,
                            variant: "destructive",
                        })
                    }

                    if (callback.success) {
                        toast({
                            description: callback.success
                        })
                    }
                })
        })
    }

    return (
        <div className="max-w-4xl mx-5 lg:mx-auto p-6 bg-white border border-[#E6E6E6] rounded-lg mb-3">
            <header className="mb-2 flex justify-between">
                <h2 className="text-2xl font-semibold">Trader Address</h2>
                {isEdit ? <div className={cn(buttonVariants({
                    variant: "outline"
                }), "cursor-pointer")}
                    onClick={() => setIsEdit(false)}
                >Cancel</div> : <div className={cn(buttonVariants({
                    variant: "outline"
                }), "cursor-pointer")}
                    onClick={() => setIsEdit(true)}
                >Edit</div>}
            </header>
            <Separator className="mb-6 mt-2" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mt-6">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Company Name..." {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>



                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-6">
                        <div className="">
                            <p className="font-semibold text-[14px]">Country:</p>
                            <AddressSelector data={countryData} selected={country} setSelected={setCountry} disabled={true} />
                        </div>

                        {state && (
                            <div>
                                <p className="font-semibold text-[14px]">State :</p>
                                <AddressSelector
                                    data={stateData}
                                    selected={state}
                                    setSelected={setState}
                                    disabled={true}
                                />
                            </div>
                        )}

                        {city && (
                            <div>
                                <p className=" font-semibold text-[14px]">City :</p>
                                <AddressSelector data={cityData} selected={city} setSelected={setCity} disabled={true} />
                            </div>
                        )}


                    </div>


                    {!isEdit && (
                        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3 text-sm font-semibold">
                            <div className="">District: <span className="font-normal">{user.district}</span></div>
                            <div className="">Barangay: <span className="font-normal">{user.brgy}</span></div>
                        </div>
                    )}
                    {isEdit && (
                        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3">
                            <Select value={district} onValueChange={setDistrict} disabled={!isEdit}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select a district" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Districts</SelectLabel>
                                        {user.role === "DONATOR" && (
                                            <>
                                                <SelectItem value="District 1">District 1</SelectItem>
                                                <SelectItem value="District 2">District 2</SelectItem>
                                                <SelectItem value="District 3">District 3</SelectItem>
                                                <SelectItem value="District 4">District 4</SelectItem>
                                                <SelectItem value="District 5">District 5</SelectItem>
                                                <SelectItem value="District 6">District 6</SelectItem>
                                            </>
                                        )}
                                        {user.role === "TRADER" && (
                                            <>
                                                <SelectItem value="District 5">District 5</SelectItem>
                                            </>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select value={barangay} onValueChange={setBarangay} disabled={!isEdit}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select a barangay" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Barangay</SelectLabel>
                                        {user.role === "DONATOR" && (
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
                                        )}
                                        {user.role === "TRADER" && (
                                            <>
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
                                            </>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}


                    {/* <div className="mt-6 mb-2">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address..." {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {/* <FormField
                            control={form.control}
                            name="brgy"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Brgy</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter brgy..." {...field} type="text" disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="House # & Street address" {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter zip code..." {...field} type="number" disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        {isEdit ? <>
                            <Button type="submit" variant="primary" className="rounded-full" isLoading={isPending} disabled={isPending}>Save Changes</Button>
                        </> : null}
                    </div>
                </form>
            </Form>
        </div >
    )
}
