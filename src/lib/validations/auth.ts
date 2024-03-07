import { z } from "zod"

export type LoginType = z.infer<typeof LoginSchema>

export const LoginSchema = z.object({
    email: z.string().email().refine(email => email.length <= 255, { message: "Email is too long" }),
    password: z.string().min(8, { message: "Invalid password." }).max(20, { message: "Invalid password." }),
})

export type RegisterType = z.infer<typeof RegisterSchema>

export const RegisterSchema = z.object({
    email: z.string().email().refine(email => email.length <= 255, { message: "Email is too long" }),
    fullname: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    password: z.string()
        .min(8, { message: "Minimum password length is 8 characters" })
        .max(20, { message: "Maximum password length is 20 characters" })
        .refine(password => {
            // reg-ex code, chat gpt generated: at least one lowercase letter, one uppercase letter, and one special character
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]+$/;
            return passwordPattern.test(password)
        }, { message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character." }),
    confirmPassword: z.string().min(8, { message: "Password does not match" }),
    terms: z.literal(true, {
        errorMap: () => ({ message: "You must accept Terms and Conditions" }),
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
})