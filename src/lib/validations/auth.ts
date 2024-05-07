import { z } from "zod"


const strongPasswordSchema = z
    .string()
    .min(8, { message: "Minimum password length is 8 characters" })
    .max(20, { message: "Maximum password length is 20 characters" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    });

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
    password: strongPasswordSchema,
    confirmPassword: z.string().min(8, { message: "Password does not match" }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
});

export type RegisterType = z.infer<typeof RegisterSchema>

const nameRegex = /^[A-Za-z]+$/;
const lastNameRegex = /^[A-Za-z]+$/;

export const RegisterSchema = z.object({
    email: z.string().email().max(255, { message: "Email is too long" }),
    name: z.string()
        .min(2, { message: "Name should be valid." })
        .max(255, { message: "Name is too long." })
        .regex(nameRegex),
    lastName: z.string()
        .min(2, { message: "Name should be valid." })
        .max(255, { message: "Name is too long." })
        .regex(lastNameRegex),
    password: z.string()
        .min(8, { message: "Minimum password length is 8 characters" })
        .max(20, { message: "Maximum password length is 20 characters" })
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }),
    confirmPassword: z.string(),
    terms: z.literal(true, {
        errorMap: () => ({ message: "You must accept Terms and Conditions" }),
    }),
    companyName: z.string().optional(),
    address: z.string().min(2, { message: "Address should be valid." }).max(255, { message: "Address is too long." }),
    // brgy: z.string(),
    // country: z.string(),
    // state: z.string(),
    // district: z.string(),
    // city: z.string(),
    zip: z.string().min(4, { message: "Invalid zip code." }).max(4, { message: "Invalid zip code." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
})