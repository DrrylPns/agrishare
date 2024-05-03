"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";


import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button, buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LoginSchema } from "@/lib/validations/auth";
import { CardWrapper } from "./card-wrapper";
import { login } from "../../actions/login";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import usePasswordToggle from "@/lib/hooks/usePasswordToggle";


export const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    form.reset();
                    setError(data.error);
                }

                if (data?.success) {
                    form.reset();
                    setSuccess(data.success);
                }

                if (data?.twoFactor) {
                    setShowTwoFactor(true)
                }
            }).catch(() => setError("Something went wrong"));
        })
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#84D187]">
            <CardWrapper
                headerLabel="Welcome back"
                backButtonLabel="Don't have an account?"
                backButtonHref="/register"
                showSocial
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center">
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={6}
                                                    render={({ slots }) => (
                                                        <InputOTPGroup>
                                                            {slots.map((slot, index) => (
                                                                <InputOTPSlot key={index} {...slot} />
                                                            ))}{" "}
                                                        </InputOTPGroup>
                                                    )}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Please enter the one-time password sent to your email.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {!showTwoFactor && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="john.doe@example.com"
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="******"
                                                        type={PasswordInputType as string}
                                                        ToggleIcon={ToggleIcon}
                                                    />
                                                </FormControl>
                                                {/* <Button
                                                    size="sm"
                                                    variant="link"
                                                    asChild
                                                    className="px-0 font-normal"
                                                >
                                                    <Link href="/reset">
                                                        Forgot password?
                                                    </Link>
                                                </Button> */}

                                                <Link href="/reset" className={cn(buttonVariants({ variant: "link" }), "px-0 font-normal")}>
                                                    Forgot password?
                                                </Link>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full"
                            variant="primary"
                        >
                            {showTwoFactor ? "Confirm" : "Login"}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    );
};