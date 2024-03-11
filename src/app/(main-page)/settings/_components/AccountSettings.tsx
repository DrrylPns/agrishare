"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { UploadDropzone } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"
import { AccountSchema, AccountType } from "@/lib/validations/user-settings"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { ImageDown } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

type AccountSettingsProps = {
    user?: User
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
    const [imageUrl, setImageUrl] = useState<string>(user?.image || "")
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const router = useRouter()

    // const imageIsEmpty = imageUrl.length === 0

    const form = useForm<AccountType>({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            name: user?.name || "",
            lastName: user?.lastName || "",
            image: user?.image || "",
            phoneNumber: user?.phoneNumber || "",
        }
    })

    const { mutate: updateAccount, isLoading } = useMutation({
        mutationFn: async ({
            name,
            lastName,
            image,
            phoneNumber,
        }: AccountType) => {
            const payload: AccountType = {
                name,
                lastName,
                image,
                phoneNumber,
            }

            const { data } = await axios.put("/api/accountSettings", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    toast({
                        title: 'Error',
                        description: "Phone number already exists!",
                        variant: 'destructive',
                    })
                }
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

    function onSubmit(values: AccountType) {
        const payload: AccountType = {
            name: values.name,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            image: imageUrl,
        }

        updateAccount(payload)
    }

    return (
        <div className="max-w-4xl mx-5 lg:mx-auto p-6 bg-white border border-[#E6E6E6] rounded-lg mb-3">
            <header className="mb-2 flex justify-between">
                <h1 className="font-bold text-2xl text-center md:text-start">Account Settings</h1>
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
            <Separator className="mt-2" />
            {/* <div className="flex justify-center items-center"> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="md:block lg:flex lg:flex-row-reverse lg:justify-between lg:items-center mb-3 lg:mb-0">
                        <div className="lg:w-[50%]">
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <div className="w-full flex flex-col gap-3 justify-center items-center">
                                        {imageUrl.length ?
                                            <div className="w-full flex items-center justify-center mt-5">
                                                <Image
                                                    src={imageUrl}
                                                    alt="productImage"
                                                    className="cursor-pointer rounded-full border border-black/20 w-[110px] h-[110px] lg:w-[135px] lg:h-[135px]"
                                                    width={70}
                                                    height={70}
                                                    onClick={() => {
                                                        setImageUrl("")
                                                    }}
                                                />
                                            </div>

                                            : <div className="w-full flex items-center justify-center mt-5">
                                                <div className="rounded-full w-[110px] h-[110px] lg:w-[135px] lg:h-[135px] border-black/20 border cursor-pointer bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                                                    <ImageDown strokeWidth={1} size={32} />
                                                </div>
                                            </div>}

                                        <div
                                            onClick={() => {
                                                setImageUrl("")
                                            }}
                                            className="rounded-full border border-[#00B207] bg-background hover:bg-accent hover:text-[#00B207] inline-flex items-center justify-center whitespace-nowrap p-2 cursor-pointer text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-[#00B207]">
                                            Choose Image
                                        </div>
                                    </div>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>Choose Image</DrawerTitle>
                                        <DrawerDescription>Note: This will be your profile picture.</DrawerDescription>

                                        {imageUrl.length ? <div
                                            className='flex justify-center items-center flex-col'
                                        >

                                            <Image
                                                alt='Done Upload'
                                                src={"/done.svg"}
                                                width={250}
                                                height={250}
                                                className='mb-3'
                                            />
                                            <h1 className='mt-3 text-gray-500'>Uploaded Successfully</h1>
                                        </div> : <UploadDropzone
                                            className="text-green"
                                            appearance={{
                                                button: "bg-[#00B207] p-2 mb-3",
                                                label: "text-green",
                                                allowedContent: "flex h-8 flex-col items-center justify-center px-2 text-green",
                                            }}
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                console.log('Files: ', res);
                                                if (res && res.length > 0 && res[0].url) {
                                                    setImageUrl(res[0].url);
                                                } else {
                                                    console.error('Please input a valid product image.', res);
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast({
                                                    title: 'Error!',
                                                    description: error.message,
                                                    variant: 'destructive',
                                                })
                                            }}
                                        />}
                                    </DrawerHeader>
                                    <DrawerFooter>
                                        <DrawerClose>
                                            <div className="flex flex-col gap-3 w-full items-center justify-center">
                                                <Button variant="primary" className="w-[320px]">Done</Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-[320px]"
                                                    onClick={() => {
                                                        setImageUrl("")
                                                    }}>Cancel</Button>
                                            </div>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>

                        <div className="lg:w-[50%] lg:flex lg:flex-col lg:gap-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter first name..." {...field} disabled={!isEdit} />
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
                                            <Input placeholder="Enter last name..." {...field} disabled={!isEdit} />
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
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Phone Number..." {...field} type="number" disabled={!isEdit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    </div>

                    <div className="mt-3">
                        {isEdit ? <>
                            <Button type="submit" variant="primary" className="rounded-full" isLoading={isLoading} disabled={isLoading}>Save Changes</Button>
                        </> : null}
                    </div>
                </form>
            </Form>
        </div>
        // </div>
    )
}
