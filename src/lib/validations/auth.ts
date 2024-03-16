import { z } from "zod"

export type LoginType = z.infer<typeof LoginSchema>

export const LoginSchema = z.object({
    email: z.string().email().refine(email => email.length <= 255, { message: "Email is too long" }),
    password: z.string().min(8, { message: "Invalid password." }).max(20, { message: "Invalid password." }),
    code: z.optional(z.string()),
})

export type CodeType = z.infer<typeof CodeSchema>

export const CodeSchema = z.object({
    code: z.string(),
})

export type ResetType = z.infer<typeof LoginSchema>

export const ResetSchema = z.object({
    email: z.string().email().refine(email => email.length <= 255, { message: "Email is too long" }),
})

export type NewPasswordType = z.infer<typeof NewPasswordSchema>

export const NewPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: "Minimum password length is 8 characters" })
        .max(20, { message: "Maximum password length is 20 characters" })
        .refine(password => {
            // reg-ex code, chat gpt generated: at least one lowercase letter, one uppercase letter, and one special character
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]+$/;
            return passwordPattern.test(password)
        }, { message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character." }),
    confirmPassword: z.string().min(8, { message: "Password does not match" }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
});

export type RegisterType = z.infer<typeof RegisterSchema>

export const RegisterSchema = z.object({
    email: z.string().email().refine(email => email.length <= 255, { message: "Email is too long" }),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    lastName: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
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