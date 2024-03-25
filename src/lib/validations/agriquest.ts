import { z } from "zod";

export type AgriquestType = z.infer<typeof AgriQuestSchema>

const Category = z.enum([
    "FRESH_FRUIT",
    "VEGETABLES",
    "TOOLS",
    "EQUIPMENTS",
    "SEEDS",
    "SOILS",
    "FERTILIZER"])

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

export const AgriQuestSchema = z.object({
    image: z.string().optional(),
    name: z.string().min(2, { message: "Name should be valid." }).max(255, { message: "Name is too long." }),
    description: z.string().min(2, { message: "Description should be valid." }).max(1000, { message: "Description is too long." }),
    quantity: z.coerce.number(),
    weight: z.coerce.number(),
    color: z.string().min(2, { message: "Color should be valid." }),
    shelfLife: z.string().min(2, { message: "Shelf life should be valid." }),
    category: Category,
    subcategory: Subcategory,
    harvestDate: z.coerce.date(),
})