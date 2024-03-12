import { z } from "zod";

export type PointsType = z.infer<typeof PointsSchema>

const TransactionType = z.enum(["TRADE", "DONATE", "EARN"])

export const PointsSchema = z.object({
    points: z.number().refine(value => value >= 0, {
        message: "Points should be a non-negative value.",
    }),
    type: TransactionType,
})