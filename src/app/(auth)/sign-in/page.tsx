"use client"
import { toast } from "@/components/ui/use-toast";
import { LoginSchema, LoginType } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { SignInDesktopView } from "./_components/SignInDesktopView";

const page = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();
    const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

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
        setIsLoading(true)

        signIn('credentials', {
            ...data,
            redirect: false,
        }).then((callback) => {
            setIsLoading(false);

            // if there is a 2FA Code then don't sign in yet and instead show the 2fa codes


            if (callback?.ok && !callback?.error) {
                toast({
                    description: "Logged In",
                });


                router.push('/agrifeed');
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
        <div>
            <SignInDesktopView />

            {/* MOBILE VIEW */}
            <div className="bg-[#84D187] md:hidden block">
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
                                {showTwoFactor && (
                                    <div className='grid gap-2'>
                                        <Label htmlFor='email'>Two Factor Code:</Label>
                                        <Input className="w-[270px]" id='email' placeholder='123456' {...register("code")} disabled={isPending} />
                                        {errors.code && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.code.message}</span>}
                                    </div>
                                )}
                                {!showTwoFactor && (
                                    <>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='email'>Email</Label>
                                            <Input className="w-[270px]" id='email' type='email' placeholder='username@example.com' {...register("email")} disabled={isPending} />
                                            {errors.email && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.email.message}</span>}
                                        </div>


                                        <div className='grid gap-2'>
                                            <Label htmlFor='password'>Password</Label>
                                            <Input className="w-[270px]" id='password' type={PasswordInputType as string} placeholder='Enter Password'{...register("password")} disabled={isPending} ToggleIcon={ToggleIcon} />
                                            {errors.password && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.password.message}</span>}
                                        </div>
                                    </>
                                )}
                            </CardContent>

                            <CardFooter className="p-0 w-full flex flex-col gap-3">
                                <Button className='w-full rounded-full mt-2' isLoading={isLoading} disabled={session ? true : false} variant={"primary"}>Login</Button>
                                <Link href="/sign-up" className="text-neutral-500 text-[14px]">Don't have an account? <span className="font-bold">Register</span></Link>
                                <Link href="/reset" className="text-neutral-500 text-[14px]">Forgot password? <span className="font-bold">Click here.</span></Link>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default page