import { z } from "zod";
import { Subcat } from "../utils";

export type AgrifeedType = z.infer<typeof AgrifeedSchema>

const Category = z.enum(["FRESH_FRUIT", "VEGETABLES", "TOOLS", "EQUIPMENTS", "SEEDS", "SOILS", "FERTILIZER"])

const ShelfLifeUnit = z.enum([
    "DAY",
    "WEEK",
    "MONTH",
    "YEAR",
]).optional()

export const AgrifeedSchema = z.object({
    id: z.optional(z.string()),
    image: z.string().optional(),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    description: z.string().min(2, { message: "Description should be valid." }).max(1000, { message: "Description is too long." }),
    quantity: z.coerce.number(),
    weight: z.coerce.number(),
    color: z.string().min(2, { message: "Color should be valid." }),
    shelfLifeDuration: z.coerce.number().min(1).optional(),
    shelfLifeUnit: ShelfLifeUnit,
    category: Category,
    subcategory: Subcat,
    type: z.optional(z.enum(["ORGANIC", "NOT_ORGANIC"])),
    harvestDate: z.coerce.date().optional(),
    preferedOffers: z.string().min(2, { message: "Preferred Offer should be valid." }),
    size: z.optional(z.string()),
})