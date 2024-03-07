"use client"
import { toast } from "@/components/ui/use-toast";
import { LoginSchema, LoginType } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import usePasswordToggle from "@/lib/hooks/usePasswordToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm<LoginType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit: SubmitHandler<LoginType> = (data: LoginType) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        }).then((callback: any) => {
            setIsLoading(false);

            if (callback?.ok && !callback?.error) {
                toast({
                    description: "Logged In",
                });

                setTimeout(() => {
                    router.push('/agrifeed');
                }, 1000)
            }

            if (callback?.error) {
                toast({
                    description: callback.error,
                    variant: "destructive"
                });
            }
        });
    }

    return (
        <div className="bg-[#84D187]">
            <Link className="flex flex-row pt-3" href="/">
                <ChevronLeft />
                Go Back
            </Link>
            <div className='h-screen w-full flex items-center justify-center'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className='w-full p-6'>
                        <CardHeader className='flex text-center'>
                            <CardTitle>Sign In</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 w-full p-0">

                            <div className='grid gap-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input className="w-[270px]" id='email' type='email' placeholder='username@example.com' {...register("email")} />
                                {errors.email && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.email.message}</span>}
                            </div>


                            <div className='grid gap-2'>
                                <Label htmlFor='password'>Password</Label>
                                <Input className="w-[270px]" id='password' type={PasswordInputType as string} placeholder='Enter Password'{...register("password")} ToggleIcon={ToggleIcon} />
                                {errors.password && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.password.message}</span>}
                            </div>
                        </CardContent>

                        <CardFooter className="p-0 w-full flex flex-col gap-3">
                            <Button className='w-full rounded-full mt-2' isLoading={isLoading} disabled={session ? true : false} variant={"primary"}>Login</Button>
                            <Link href="/sign-up" className="text-neutral-500 text-[14px]">Don't have an account? <span className="font-bold">Register</span></Link>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}

export default page