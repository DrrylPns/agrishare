import { z } from "zod";
import { Subcategory } from "../utils";

export type AgriquestType = z.infer<typeof AgriQuestSchema>

const Category = z.enum([
    "FRESH_FRUIT",
    "VEGETABLES",
    "TOOLS",
    "EQUIPMENTS",
    "SEEDS",
    "SOILS",
    "FERTILIZER",
])

export const AgriQuestSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    description: z.string().min(2, { message: "Description should be valid." }).max(1000, { message: "Description is too long." }),
    quantity: z.coerce.number(),
    shelfLife: z.string().min(2, { message: "Shelf life should be valid." }),
    category: Category,
    qtyPerTrade: z.coerce.number(),
    // weight: z.coerce.number(),
    // color: z.string().min(2, { message: "Color should be valid." }),
    // subcategory: Subcategory,
    // harvestDate: z.coerce.date(),
})

export type AgrichangeType = z.infer<typeof AgrichangeSchema>

export const AgrichangeSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    description: z.string().min(2, { message: "Description should be valid." }).max(1000, { message: "Description is too long." }),
    quantity: z.coerce.number(),
    weight: z.coerce.number(),
    color: z.string().min(2, { message: "Color should be valid." }),
    shelfLife: z.string().min(2, { message: "Shelf life should be valid." }),
    category: Category,
    subcategory: Subcategory,
    harvestDate: z.coerce.date().optional(),
    type: z.enum(["ORGANIC", "NOT_ORGANIC"]).optional(),
    pointsNeeded: z.coerce.number().optional(),
    // qtyPerTrade: z.coerce.number(),
    size: z.optional(z.string()),
})

export type DateOfPickupInAgriquestType = z.infer<typeof DateOfPickupInAgriquest>

export const DateOfPickupInAgriquest = z.object({
    pickupDate: z.date({
        required_error: "Pick up date is required",
    }),
})