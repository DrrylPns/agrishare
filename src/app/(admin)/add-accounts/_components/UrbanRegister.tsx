"use client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { UrbanFarmerSchema, UrbanFarmerType } from "@/lib/validations/user-settings"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export const UrbanRegister = () => {

    const form = useForm<UrbanFarmerType>({
        resolver: zodResolver(UrbanFarmerSchema),
    })

    const { mutate: createUrban, isLoading } = useMutation({
        mutationFn: async ({
            confirmPassword,
            lastName,
            middleInitial,
            name,
            password,
            phoneNumber,
            userId,
            email,
        }: UrbanFarmerType) => {
            const payload: UrbanFarmerType = {
                confirmPassword,
                lastName,
                middleInitial,
                name,
                password,
                phoneNumber,
                userId,
                email,
            }

            const { data } = await axios.post("/api/createUrban", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    toast({
                        description: "User id already taken.",
                        variant: 'destructive',
                    })
                }
            } else {
                return toast({
                    description: "Error, something went wrong!",
                    variant: 'destructive',
                })
            }
        },
        onSuccess: (data) => {
            toast({
                description: 'Success!',
                variant: 'default',
            })
            
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    })

    function onSubmit(data: UrbanFarmerType) {
        const payload: UrbanFarmerType = {
            confirmPassword: data.confirmPassword,
            lastName: data.lastName,
            middleInitial: data.middleInitial,
            name: data.name,
            password: data.password,
            phoneNumber: data.phoneNumber,
            userId: data.userId,
            email: data.email,
        }

        createUrban(payload)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="middleInitial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle Initial</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter middle initial..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter user id..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact #</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter number..." {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter password..." {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Confirm password..." {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>Save</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
