import { z } from "zod";

export type DonationType = z.infer<typeof DonationSchema>

export const DonationSchema = z.object({
    image: z.string({
        required_error: 'Upload your E-Signature!'
    }),
    urbanFarmName: z.string({
        required_error: 'Enter a valid Urban farm / Organization!'
    }),
    donator: z.string({
        required_error:'Enter a valid donator name!'
    }),
    productName: z.string({
        required_error:'Enter a valid product name'
    }),
    date: z.coerce.date(),
})