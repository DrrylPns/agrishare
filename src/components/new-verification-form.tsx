"use client";
import { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation";
import { newVerification } from "../../actions/new-verification";
import { toast } from "./ui/use-toast";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const NewVerificationForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()



    const onSubmit = useCallback(() => {
        if (success || error) return

        if (!token) {
            setError("Missing Token")
            return
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong!")
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[#84D187]">
            <CardWrapper
                headerLabel="Confirming your verification"
                backButtonLabel="Back to login"
                backButtonHref="/sign-in"
            >
                <div className="flex items-center w-full justify-center">
                    {!success && !error && (
                        <BeatLoader />
                    )}
                    <FormSuccess message={success} />
                    {!success && (
                        <FormError message={error} />
                    )}
                </div>
            </CardWrapper>
        </div>
    )
}