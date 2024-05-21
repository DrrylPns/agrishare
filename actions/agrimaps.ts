"use server"

import { AgrimapSchema, AgrimapType } from "@/lib/validations/agrimaps"
import { auth } from "../auth"
import prisma from "@/lib/db"

export const createAgrimaps = async (values: AgrimapType, barangay: string, district: string) => {
    try {
        const session = await auth()

        if (!session || session.user.role !== "ADMIN") return { error: "No user found" }

        const validatedFields = AgrimapSchema.safeParse(values)

        if (!validatedFields.success) return { error: "Invalid fields" }

        const { lat, lng, name } = validatedFields.data

        if (!barangay) return { error: "No barangay selected!" }

        if (!district) return { error: "No district selected!" }

        const latExists = await prisma.coordinates.findFirst({
            where: {
                lat,
            },
        })

        const lngExists = await prisma.coordinates.findFirst({
            where: {
                lang: lng
            },
        })

        const nameExists = await prisma.coordinates.findUnique({
            where: {
                name
            }
        })

        if (nameExists) return { error: "This urban farm name in the agrimaps already exists in the current database!" }
        if (latExists && lngExists) return { error: "This coordinate already exists in the current database!" }

        await prisma.coordinates.create({
            data: {
                lat,
                lang: lng,
                name,
                barangay,
                district,
            }
        })

        return { success: "Created agrimap!" }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchAgrimaps = async () => {
    try {
        const agrimaps = await prisma.coordinates.findMany();

        return agrimaps;
    } catch (error) {
        throw new Error(error as any);
    }
};

export const fetchUserSideAgrimaps = async (barangay?: string) => {
    try {
        if (barangay) {
            const agrimaps = await prisma.coordinates.findMany({
                include: {
                    _count: {
                        select: {
                            donations: true
                        }
                    }
                },
                where: {
                    barangay
                }
            });

            return agrimaps
        } else {
            const agrimaps = await prisma.coordinates.findMany({
                include: {
                    _count: {
                        select: {
                            donations: true
                        }
                    }
                }
            });

            return agrimaps
        }
    } catch (error) {
        throw new Error(error as any)
    }
}