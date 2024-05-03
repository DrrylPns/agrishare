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
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { ChangePasswordSchema, ChangePasswordType } from "@/lib/validations/user-settings"
import { useState } from "react"
import { cn } from "@/lib/utils"
import usePasswordToggle from "@/lib/hooks/usePasswordToggle"

type PasswordSettingsProps = {
    user: User
}

export const PasswordSettings: React.FC<PasswordSettingsProps> = ({ user }) => {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [CurrentPasswordInputType, CurrentToggleIcon] = usePasswordToggle();
    const [NewPasswordInputType, NewToggleIcon] = usePasswordToggle();
    const [ConfirmPasswordInputType, ConfirmToggleIcon] = usePasswordToggle();

    const form = useForm<ChangePasswordType>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    })

    const { mutate: oldPasswordRequest, isLoading } = useMutation({
        mutationFn: async ({
            oldPassword,
            newPassword,
            confirmNewPassword
        }: ChangePasswordType) => {
            const payload: ChangePasswordType = {
                oldPassword,
                newPassword,
                confirmNewPassword,
            };
            const { data } = await axios.post("api/changePassword", payload);
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 400) {
                    return toast({
                        title: "Request Failed",
                        description: "Old Password is incorrect!",
                        variant: "destructive"
                    })
                }
            } else {
                return toast({
                    title: "Error",
                    description: "Something went wrong, please try again later!",
                    variant: "destructive"
                })
            }
        },
        onSuccess: () => {
            toast({
                title: "Success!",
                description: "Password Updated Successfully",
                variant: "default",
            });

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    })

    const onSubmit: SubmitHandler<ChangePasswordType> = (data: ChangePasswordType) => {
        if (data.oldPassword === data.newPassword) {
            return toast({
                title: "Invalid Action!",
                description: "New password must be different from the current password",
                variant: "destructive"
            })
        } else {
            const payload: ChangePasswordType = {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            }

            oldPasswordRequest(payload)
        }
    }

    return (
        <div className="max-w-4xl mx-5 lg:mx-auto p-6 bg-white border border-[#E6E6E6] rounded-lg mb-11">
            <header className="mb-2 flex justify-between">
                <h2 className="text-2xl font-semibold">Change Password</h2>
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
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Current Password..."
                                            {...field}
                                            disabled={!isEdit}
                                            type={CurrentPasswordInputType as string}
                                            ToggleIcon={CurrentToggleIcon}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter New Password..."
                                            {...field}
                                            disabled={!isEdit}
                                            type={NewPasswordInputType as string}
                                            ToggleIcon={NewToggleIcon}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm New Password..."
                                            {...field}
                                            disabled={!isEdit}
                                            type={ConfirmPasswordInputType as string}
                                            ToggleIcon={ConfirmToggleIcon}
                                        />
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
