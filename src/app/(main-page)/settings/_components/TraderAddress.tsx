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
import { useEffect, useState } from "react"
import AddressSelector from "@/components/AddressSelector"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
    const [stateData, setStateData] = useState();
    const [cityData, setCityData] = useState();
    const [country, setCountry] = useState(countryData[173]);
    const [state, setState] = useState<StateType>();
    const [city, setCity] = useState<CityType>();
    const [isEdit, setIsEdit] = useState<boolean>(false)


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
        stateData && setState(stateData[0]);
    }, [stateData]);

    useEffect(() => {
        cityData && setCity(cityData[0]);
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
        },
    })

    const { mutate: updateAddress, isLoading } = useMutation({
        mutationFn: async ({
            address,
            city,
            companyName,
            country,
            state,
            zip,
        }: TraderType) => {
            const payload: TraderType = {
                address,
                city,
                companyName,
                country,
                state,
                zip,
            }

            const { data } = await axios.put("/api/accountAddress", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {

            } else {
                return toast({
                    title: 'Something went wrong.',
                    description: "Error",
                    variant: 'destructive',
                })
            }
        },
        onSuccess: (data) => {
            toast({
                title: 'Success!',
                description: `${data}`,
                variant: 'default',
            })

            setTimeout(() => {
                window.location.reload(),
                    router.refresh()
            }, 1000)
        }
    })

    function onSubmit(values: TraderType) {
        const payload: TraderType = {
            address: values.address,
            zip: values.zip,
            companyName: values.companyName,
            country: country.name,
            state: state?.name,
            city: city?.name,
        }

        updateAddress(payload)
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

                    <div className="mt-6">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address..." {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-6">
                        <div className="">
                            <p className="font-semibold text-[14px]">Country:</p>
                            <AddressSelector data={countryData} selected={country} setSelected={setCountry} disabled={!isEdit} />
                        </div>

                        {state && (
                            <div>
                                <p className="font-semibold text-[14px]">State :</p>
                                <AddressSelector
                                    data={stateData}
                                    selected={state}
                                    setSelected={setState}
                                    disabled={!isEdit}
                                />
                            </div>
                        )}

                        {city && (
                            <div>
                                <p className=" font-semibold text-[14px]">City :</p>
                                <AddressSelector data={cityData} selected={city} setSelected={setCity} disabled={!isEdit} />
                            </div>
                        )}


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
                            <Button type="submit" variant="primary" className="rounded-full" isLoading={isLoading} disabled={isLoading}>Save Changes</Button>
                        </> : null}
                    </div>
                </form>
            </Form>
        </div>
    )
}
