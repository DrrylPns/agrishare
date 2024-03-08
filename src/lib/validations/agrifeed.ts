import { z } from "zod";

export type AgrifeedType = z.infer<typeof AgrifeedSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])
const Type = z.enum(["ORGANIC", "INORGANIC"])

export const AgrifeedSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    description: z.string().min(2, { message: "Description should be valid." }).max(1000, { message: "Description is too long." }),
    quantity: z.coerce.number(),
    weight: z.coerce.number(),
    color: z.string().min(2, { message: "Color should be valid." }),
    shelfLife: z.string().min(2, { message: "Shelf life should be valid." }),
    category: Category,
    type: Type,
    harvestDate: z.coerce.date(),
    preferedOffers: z.string().min(2, { message: "Preferred Offer should be valid." }),
})