import { z } from "zod";

export type AgrifeedType = z.infer<typeof AgrifeedSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])
const Subcategory = z.enum([
    "LEAFY_VEGETABLES",
    "PODDED_VEGETABLES",
    "FRUIT_VEGETABLES",
    "ROOT_VEGETABLES",
    "HERBS_VEGETABLES",
    "FRUIT1",
    "FRUIT2",
    "SMALL",
    "MEDIUM",
    "LARGE",
    "SEEDS1",
    "SEEDS2",
    "ORGANIC_SOIL",
    "NOT_ORGANIC_SOIL",
    "ORGANIC_FERTILIZER",
    "NOT_ORGANIC_FERTILIZER",
])
const ShelfLifeUnit = z.enum([
    "DAY",
    "WEEK",
    "MONTH",
    "YEAR",
])

export const AgrifeedSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    description: z.string().min(2, { message: "Description should be valid." }).max(1000, { message: "Description is too long." }),
    quantity: z.coerce.number(),
    weight: z.coerce.number(),
    color: z.string().min(2, { message: "Color should be valid." }),
    shelfLifeDuration: z.coerce.number().min(1),
    shelfLifeUnit: ShelfLifeUnit,
    category: Category,
    subcategory: Subcategory,
    type: z.optional(z.enum(["ORGANIC", "NOT_ORGANIC"])),
    harvestDate: z.coerce.date(),
    preferedOffers: z.string().min(2, { message: "Preferred Offer should be valid." }),
})