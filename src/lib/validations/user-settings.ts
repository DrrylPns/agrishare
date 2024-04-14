import { z } from "zod"

export type AccountType = z.infer<typeof AccountSchema>

export const AccountSchema = z.object({
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    lastName: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    phoneNumber: z.string()
        .refine(phone => {
            const phMobilePattern = /^(09\d{9})$/;
            return phMobilePattern.test(phone)
        }, { message: "Invalid Mobile Number" })
        .optional(),
    image: z.string({
        required_error: "Please select an image."
    }).optional(),
    isTwoFactorEnabled: z.optional(z.boolean()),
})

export type TraderType = z.infer<typeof TraderSchema>

export const TraderSchema = z.object({
    companyName: z.string().optional(),
    address: z.string().min(2, { message: "Address should be valid." }).max(255, { message: "Address is too long." }).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().min(4, { message: "Invalid zip code." }).max(4, { message: "Invalid zip code." }).optional(),
})

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>

export const ChangePasswordSchema = z.object({
    oldPassword: z.string()
        .min(8, { message: "Please enter a valid password" })
        .max(20, { message: "Maximum password length is 20 characters" }),
    newPassword: z.string()
        .min(8, { message: "Minimum password length is 8 characters" })
        .max(20, { message: "Maximum password length is 20 characters" })
        .refine(password => {
            // reg-ex code, chat gpt generated: at least one lowercase letter, one uppercase letter, and one special character
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]+$/;
            return passwordPattern.test(password)
        }, { message: "Password must contain at least one lowercase letter, one uppercase letter, and one special character." }),
    confirmNewPassword: z.string().min(8, { message: "Password does not match" }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Password does not match",
    path: ["confirmNewPassword"],
})

export type UrbanFarmerType = z.infer<typeof UrbanFarmerSchema>

export const UrbanFarmerSchema = z.object({
    email: z.string().email().refine(email => email.length <= 255, { message: "Email is too long" }),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    lastName: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    middleInitial: z.string().min(1, { message: "Middle initial should be valid" }).max(2, { message: "Middle initial should be valid" }),
    phoneNumber: z.string()
        .refine(phone => {
            const phMobilePattern = /^(09\d{9})$/;
            return phMobilePattern.test(phone)
        }, { message: "Invalid Mobile Number" }),
    // userId: z.string().min(2, { message: "User ID should be valid." }).max(20, { message: "User ID is too long." }),
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
})