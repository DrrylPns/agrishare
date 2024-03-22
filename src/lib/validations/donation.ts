import { z } from "zod";

export type DonationType = z.infer<typeof DonationSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])
const Subcategory = z.enum([
    "LEAFY_VEGETABLES",
    "PODDED_VEGETABLES",
    "FRUIT_VEGETABLES",
    "ROOT_VEGETABLES",
    "HERBS_VEGETABLES",
    "FRUIT1",
    "FRUIT2",
    "TOOLS1",
    "EQUIPMENTS1",
    "SEEDS1",
    "SEEDS2",
    "SOILS1",
    "SOILS2",
    "SOILS3",
    "FERTILIZER1"])

export const DonationSchema = z.object({
    donatee: z.string().min(2, { message: "Invalid donatee." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    name: z.string().min(2, { message: "Invalid name." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    product: z.string().min(2, { message: "Invalid product." }).max(35, { message: "Invalid input, you exceeded the amount of characters." }),
    image: z.string().optional(),
    quantity: z.coerce.number(),
    subcategory: Subcategory,
    category: Category,
})