import { z } from "zod"

export type AccountType = z.infer<typeof AccountSchema>

export const AccountSchema = z.object({
    fullname: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }).optional(),
    phoneNumber: z.string()
        .refine(phone => {
            const phMobilePattern = /^(09\d{9})$/;
            return phMobilePattern.test(phone)
        }, { message: "Invalid Mobile Number" })
        .optional(),
    image: z.string({
        required_error: "Please select an image."
    }).optional(),
})

export type TraderType = z.infer<typeof TraderSchema>

export const TraderSchema = z.object({
    companyName: z.string().min(2, { message: "Company Name should be valid." }).max(255, { message: "Company Name is too long." }).optional(),
    address: z.string().min(2, { message: "Address should be valid." }).max(255, { message: "Address is too long." }).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().min(4, { message: "Invalid zip code." }).max(4, { message: "Invalid zip code." }).optional(),
})