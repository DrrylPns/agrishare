"use server"

import prisma from "@/lib/db"
import { AgrichangeSchema, AgrichangeType } from "@/lib/validations/agriquest"
import { auth } from "../auth"
import { getUserById } from "../data/user"
import { revalidatePath } from "next/cache"
import { ClaimStatus, Status } from "@prisma/client"
import { generateClaimedHistoryID } from "@/lib/utils"
import { DateOfPickupInAgrichange, DateOfPickupInAgrichangeType } from "@/lib/validations/agrichange"

export const createAgrichange = async (values: AgrichangeType, image: string, size: string | null) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "Invalid action, can't create agrichange if you are not an admin!" }

        const validatedFields = AgrichangeSchema.safeParse(values)

        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const {
            category,
            color,
            type,
            description,
            harvestDate,
            name,
            quantity,
            shelfLife,
            subcategory,
            weight,
            pointsNeeded,
            // qtyPerTrade,
        } = validatedFields.data

        let status: Status;

        if (quantity > 5) {
            status = Status.INSTOCK
        } else if (quantity >= 1 && quantity <= 4) {
            status = Status.LOWSTOCK
        } else {
            status = Status.OUTOFSTOCK
        }

        let ptsEquivalent

        if (subcategory === "Eggplant" || subcategory === "Ampalaya" || subcategory === "Tomato" || subcategory === "Chili" || subcategory === "BellPepperGreen" || subcategory === "BellPepperRed" || subcategory === "Squash" || subcategory === "BlueTarnette" || subcategory === "Patola" || subcategory === "Okra") {
            ptsEquivalent = 32.75 / 0.18
        } else if (subcategory === "AmpalayaLeaves" || subcategory === "WaterSpinach" || subcategory === "SweetPotatoLeaves" || subcategory === "MalabarSpinach" || subcategory === "JewsMallow" || subcategory === "ChiliLeaves" || subcategory === "Moringaoleifera" || subcategory === "TaroLeaves" || subcategory === "OnionLeaves" || subcategory === "PetchayNative" || subcategory === "PetchayBaguio" || subcategory === "CabbageRareBall" || subcategory === "CabbageScorpio" || subcategory === "Basil") {
            ptsEquivalent = 35 / 0.3
        } else if (subcategory === "Sitao" || subcategory === "BaguioBeans" || subcategory === "GiantPatani") {
            ptsEquivalent = 35 / 0.25
        } else if (subcategory === "Carrots" || subcategory === "WhitePotato" || subcategory === "Chayote" || subcategory === "RedOnion" || subcategory === "WhiteOnion" || subcategory === "WhiteOnionImported" || subcategory === "GarlicImported" || subcategory === "GarlicNative" || subcategory === "Ginger") {
            ptsEquivalent = 72 / 0.3
        } else if (subcategory === "ORGANIC_FERTILIZER") {
            ptsEquivalent = 50 / 0.36
        } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
            ptsEquivalent = 60 / 0.9
        } else if (subcategory === "ORGANIC_SOIL") {
            ptsEquivalent = 7.5 / 0.75
        } else if (subcategory === "NOT_ORGANIC_SOIL") {
            ptsEquivalent = 15 / 0.25
        } else if (subcategory === "Calamansi" || subcategory === "MandarinOrange") {
            ptsEquivalent = 26 / 0.13
        } else if (subcategory === "Banana" || subcategory === "Mango" || subcategory === "Avocado" || subcategory === "CottonFruit" || subcategory === "Pineapple" || subcategory === "Soursop" || subcategory === "CustardApple" || subcategory === "Papaya" || subcategory === "Lanzones") {
            ptsEquivalent = 56 / 0.82
        } else if (subcategory === "COCONUT") {
            ptsEquivalent = 55 / 0.18
        } else if (subcategory === "GiantPataniSeed" || subcategory === "BlueTarnetteSeed" || subcategory === "AmpalayaSeed" || subcategory === "PatolaSeed" || subcategory === "OkraSeed" || subcategory === "BasilSeed" || subcategory === "Talong" || subcategory === "Sitaw" || subcategory === "BaguioBeansSeed") {
            ptsEquivalent = 54 / 0.18
        } else if (subcategory === "WATER_HOSE" && size === "1/4") {
            ptsEquivalent = 28 / 1.1
        } else if (subcategory === "WATER_HOSE" && size === "1/2") {
            ptsEquivalent = 35 / 0.9
        } else if (subcategory === "WATER_HOSE" && size === "3/4") {
            ptsEquivalent = 42 / 0.7
        } else if (subcategory === "GARDEN_POTS" && size === "Small") {
            ptsEquivalent = 100 / 0.54
        } else if (subcategory === "GARDEN_POTS" && size === "Medium") {
            ptsEquivalent = 150 / 0.7
        } else if (subcategory === "GARDEN_POTS" && size === "Large") {
            ptsEquivalent = 300 / 1.4
        } else if (subcategory === "BUCKET" && size === "Small") {
            ptsEquivalent = 60 / 0.4
        } else if (subcategory === "BUCKET" && size === "Medium") {
            ptsEquivalent = 100 / 0.54
        } else if (subcategory === "BUCKET" && size === "Large") {
            ptsEquivalent = 125 / 0.64
        } else if (subcategory === "KALAYKAY" && size === "Small") {
            ptsEquivalent = 75 / 0.33
        } else if (subcategory === "KALAYKAY" && size === "Large") {
            ptsEquivalent = 250 / 0.52
        } else if (subcategory === "SHOVEL" && size === "Small") {
            ptsEquivalent = 75 / 0.33
        } else if (subcategory === "SHOVEL" && size === "Large") {
            ptsEquivalent = 250 / 0.52
        } else if (subcategory === "HOES" || subcategory === "HAND_PRUNES") {
            ptsEquivalent = 250 / 0.52
        } else if (subcategory === "GLOVES") {
            ptsEquivalent = 55 / 0.48
        } else if (subcategory === "WHEEL_BARROW") {
            ptsEquivalent = 3500 / 2
        } else if (category === "SEEDS") {
            ptsEquivalent = 25 / 0.325
        } else {
            ptsEquivalent = 0.15
        }

        // let calculatedPoints

        // if (subcategory === "FRUIT_VEGETABLES") {
        //     calculatedPoints = 35 / 0.18
        // } else if (subcategory === "LEAFY_VEGETABLES") {
        //     calculatedPoints = 35 / 0.15
        // } else if (subcategory === "PODDED_VEGETABLES") {
        //     calculatedPoints = 35 / 0.25
        // } else if (subcategory === "ROOT_VEGETABLES") {
        //     calculatedPoints = 72.25 / 0.15
        // } else if (subcategory === "ORGANIC_FERTILIZER") {
        //     calculatedPoints = 50 / 0.36
        // } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
        //     calculatedPoints = 60 / 0.9
        // } else if (subcategory === "ORGANIC_SOIL") {
        //     calculatedPoints = 7.5 / 0.75
        // } else if (subcategory === "NOT_ORGANIC_SOIL") {
        //     calculatedPoints = 15 / 0.25
        // } else if (subcategory === "CITRUS_FRUITS") {
        //     calculatedPoints = 13 / 0.26
        // } else if (subcategory === "COCONUT") {
        //     calculatedPoints = 54 / 0.108
        // } else if (subcategory === "TROPICAL_FRUIT") {
        //     calculatedPoints = 28 / 0.082
        // } else if (subcategory === "WATER_HOSE" && size === "1/4") {
        //     calculatedPoints = 28 / 1.1
        // } else if (subcategory === "WATER_HOSE" && size === "1/2") {
        //     calculatedPoints = 35 / 0.9
        // } else if (subcategory === "WATER_HOSE" && size === "3/4") {
        //     calculatedPoints = 42 / 0.7
        // } else if (subcategory === "GARDEN_POTS" && size === "Small") {
        //     calculatedPoints = 100 / 0.27
        // } else if (subcategory === "GARDEN_POTS" && size === "Medium") {
        //     calculatedPoints = 150 / 0.35
        // } else if (subcategory === "GARDEN_POTS" && size === "Large") {
        //     calculatedPoints = 300 / 0.7
        // } else if (subcategory === "BUCKET" && size === "Small") {
        //     calculatedPoints = 60 / 0.2
        // } else if (subcategory === "BUCKET" && size === "Medium") {
        //     calculatedPoints = 100 / 0.27
        // } else if (subcategory === "BUCKET" && size === "Large") {
        //     calculatedPoints = 125 / 0.32
        // } else if (subcategory === "KALAYKAY" && size === "Small") {
        //     calculatedPoints = 75 / 0.33
        // } else if (subcategory === "KALAYKAY" && size === "Large") {
        //     calculatedPoints = 250 / 0.52
        // } else if (subcategory === "SHOVEL" && size === "Small") {
        //     calculatedPoints = 75 / 0.33
        // } else if (subcategory === "SHOVEL" && size === "Large") {
        //     calculatedPoints = 250 / 0.52
        // } else if (subcategory === "HOES") {
        //     calculatedPoints = 250 / 0.52
        // } else if (category === "EQUIPMENTS" && subcategory === "SMALL") {
        //     calculatedPoints = 150 / 0.52
        // } else if (category === "EQUIPMENTS" && subcategory === "MEDIUM") {
        //     calculatedPoints = 200 / 0.52
        // } else if (category === "EQUIPMENTS" && subcategory === "LARGE") {
        //     calculatedPoints = 250 / 0.52
        // } else if (subcategory === "GLOVES") {
        //     calculatedPoints = 55 / 0.24
        // } else if (subcategory === "WHEEL_BARROW") {
        //     calculatedPoints = 3500 / 2
        // } else if (subcategory === "HAND_PRUNES") {
        //     calculatedPoints = 157.5 / 0.513
        // } else if (category === "SEEDS") {
        //     calculatedPoints = 25 / 0.65
        // } else {
        //     calculatedPoints = 0.15
        // }

        await prisma.agriChange.create({
            data: {
                category,
                color,
                description,
                harvestDate: harvestDate,
                image: image,
                name,
                shelfLife,
                type,
                status,
                // @ts-ignore
                subcategory,
                weight,
                // quantityPerTrade: qtyPerTrade,
                quantity,
                pointsNeeded: ptsEquivalent, // calculate points needed dpende sa value ng category / subcategory
                userId: user.id,
            }
        })

        revalidatePath("/add-agrichange")
        return { success: "Agrichange created" }
    } catch (error) {
        throw new Error(`Error:, ${error}`)
    }
}

export const updateAgrichange = async (values: AgrichangeType, image: string, id: string, size: string | null) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        if (user.role !== "ADMIN") return { error: "Invalid action, can't update agrichange if you are not an admin!" }

        const validatedFields = AgrichangeSchema.safeParse(values)

        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const {
            category,
            color,
            type,
            description,
            harvestDate,
            name,
            quantity,
            shelfLife,
            subcategory,
            weight,
            // pointsNeeded,
            // qtyPerTrade,
        } = validatedFields.data

        let status: Status;

        if (quantity > 5) {
            status = Status.INSTOCK
        } else if (quantity >= 1 && quantity <= 4) {
            status = Status.LOWSTOCK
        } else {
            status = Status.OUTOFSTOCK
        }

        let ptsEquivalent

        if (subcategory === "Eggplant" || subcategory === "Ampalaya" || subcategory === "Tomato" || subcategory === "Chili" || subcategory === "BellPepperGreen" || subcategory === "BellPepperRed" || subcategory === "Squash" || subcategory === "BlueTarnette" || subcategory === "Patola" || subcategory === "Okra") {
            ptsEquivalent = 32.75 / 0.18
        } else if (subcategory === "AmpalayaLeaves" || subcategory === "WaterSpinach" || subcategory === "SweetPotatoLeaves" || subcategory === "MalabarSpinach" || subcategory === "JewsMallow" || subcategory === "ChiliLeaves" || subcategory === "Moringaoleifera" || subcategory === "TaroLeaves" || subcategory === "OnionLeaves" || subcategory === "PetchayNative" || subcategory === "PetchayBaguio" || subcategory === "CabbageRareBall" || subcategory === "CabbageScorpio" || subcategory === "Basil") {
            ptsEquivalent = 35 / 0.3
        } else if (subcategory === "Sitao" || subcategory === "BaguioBeans" || subcategory === "GiantPatani") {
            ptsEquivalent = 35 / 0.25
        } else if (subcategory === "Carrots" || subcategory === "WhitePotato" || subcategory === "Chayote" || subcategory === "RedOnion" || subcategory === "WhiteOnion" || subcategory === "WhiteOnionImported" || subcategory === "GarlicImported" || subcategory === "GarlicNative" || subcategory === "Ginger") {
            ptsEquivalent = 72 / 0.3
        } else if (subcategory === "ORGANIC_FERTILIZER") {
            ptsEquivalent = 50 / 0.36
        } else if (subcategory === "NOT_ORGANIC_FERTILIZER") {
            ptsEquivalent = 60 / 0.9
        } else if (subcategory === "ORGANIC_SOIL") {
            ptsEquivalent = 7.5 / 0.75
        } else if (subcategory === "NOT_ORGANIC_SOIL") {
            ptsEquivalent = 15 / 0.25
        } else if (subcategory === "Calamansi" || subcategory === "MandarinOrange") {
            ptsEquivalent = 26 / 0.13
        } else if (subcategory === "Banana" || subcategory === "Mango" || subcategory === "Avocado" || subcategory === "CottonFruit" || subcategory === "Pineapple" || subcategory === "Soursop" || subcategory === "CustardApple" || subcategory === "Papaya" || subcategory === "Lanzones") {
            ptsEquivalent = 56 / 0.82
        } else if (subcategory === "COCONUT") {
            ptsEquivalent = 55 / 0.18
        } else if (subcategory === "GiantPataniSeed" || subcategory === "BlueTarnetteSeed" || subcategory === "AmpalayaSeed" || subcategory === "PatolaSeed" || subcategory === "OkraSeed" || subcategory === "BasilSeed" || subcategory === "Talong" || subcategory === "Sitaw" || subcategory === "BaguioBeansSeed") {
            ptsEquivalent = 54 / 0.18
        } else if (subcategory === "WATER_HOSE" && size === "1/4") {
            ptsEquivalent = 28 / 1.1
        } else if (subcategory === "WATER_HOSE" && size === "1/2") {
            ptsEquivalent = 35 / 0.9
        } else if (subcategory === "WATER_HOSE" && size === "3/4") {
            ptsEquivalent = 42 / 0.7
        } else if (subcategory === "GARDEN_POTS" && size === "Small") {
            ptsEquivalent = 100 / 0.54
        } else if (subcategory === "GARDEN_POTS" && size === "Medium") {
            ptsEquivalent = 150 / 0.7
        } else if (subcategory === "GARDEN_POTS" && size === "Large") {
            ptsEquivalent = 300 / 1.4
        } else if (subcategory === "BUCKET" && size === "Small") {
            ptsEquivalent = 60 / 0.4
        } else if (subcategory === "BUCKET" && size === "Medium") {
            ptsEquivalent = 100 / 0.54
        } else if (subcategory === "BUCKET" && size === "Large") {
            ptsEquivalent = 125 / 0.64
        } else if (subcategory === "KALAYKAY" && size === "Small") {
            ptsEquivalent = 75 / 0.33
        } else if (subcategory === "KALAYKAY" && size === "Large") {
            ptsEquivalent = 250 / 0.52
        } else if (subcategory === "SHOVEL" && size === "Small") {
            ptsEquivalent = 75 / 0.33
        } else if (subcategory === "SHOVEL" && size === "Large") {
            ptsEquivalent = 250 / 0.52
        } else if (subcategory === "HOES" || subcategory === "HAND_PRUNES") {
            ptsEquivalent = 250 / 0.52
        } else if (subcategory === "GLOVES") {
            ptsEquivalent = 55 / 0.48
        } else if (subcategory === "WHEEL_BARROW") {
            ptsEquivalent = 3500 / 2
        } else if (category === "SEEDS") {
            ptsEquivalent = 25 / 0.325
        } else {
            ptsEquivalent = 0.15
        }

        await prisma.agriChange.update({
            where: { id },
            data: {
                category,
                color,
                description,
                harvestDate,
                image: image,
                name,
                shelfLife,
                type,
                status,
                subcategory,
                weight,
                quantity,
                pointsNeeded: ptsEquivalent,
                // quantityPerTrade: qtyPerTrade,
            }
        })

        revalidatePath("/add-agrichange")
        return { success: "Agrichange updated" }
    } catch (error) {
        throw new Error(`Error:, ${error}`)
    }
}

export const claimAgrichange = async (id: string, data: DateOfPickupInAgrichangeType, quantityPerTrade: number) => {
    try {
        const validatedFields = DateOfPickupInAgrichange.safeParse(data)

        if (!validatedFields.success) return { error: "Invalid fields!" }

        const { pickupDate } = validatedFields.data

        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const itm = generateClaimedHistoryID()

        const currentAgriChange = await prisma.agriChange.findUnique({
            where: { id }
        })

        if (!currentAgriChange) return { error: "No agrichange item found!" }

        const currentPoints = currentAgriChange.pointsNeeded * quantityPerTrade

        if (user.points < currentPoints) return { error: "Insufficient points" }

        if (currentAgriChange.quantity < quantityPerTrade) return { error: "Insufficient Stocks" }

        await prisma.agriChange.update({
            where: { id: currentAgriChange.id },
            data: {
                quantity: {
                    decrement: quantityPerTrade
                }
            }
        })

        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: user.points - currentAgriChange.pointsNeeded * quantityPerTrade
            }
        })

        await prisma.claim.create({
            data: {
                itm,
                agriChangeId: currentAgriChange.id,
                quantity: quantityPerTrade,
                userId: user.id,
                pickUpDate: pickupDate,
            }
        })

        await prisma.notification.create({
            data: {
                type: "PROCESSING",
                userId: user.id,
            }
        })

        revalidatePath("/agrichange")
        return { success: "Agrichange claiming intent is now being reviewed!" }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fecthAgriChangeTransactionsByUser = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const transactions = await prisma.claim.findMany({
            include: {
                agriChange: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            where: { userId: session.user.id }
        })

        return transactions
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchAgriChangeTransactions = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const user = await getUserById(session.user.id)

        if (!user) return { error: "No user found!" }

        const transactions = await prisma.claim.findMany({
            include: {
                agriChange: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        })

        return transactions

    } catch (error: any) {
        throw new Error(error)
    }
}

export const handleClaim = async (status: ClaimStatus, claimId: string, userId: string, points: number, agrichangeId: string) => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const currentClaim = await prisma.claim.findUnique({
            where: { id: claimId }
        })

        if (!currentClaim) return { error: "Claim intent not found." };

        const claimer = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!claimer) return { error: "No claimer found!" }

        if (status === "APPROVED" && currentClaim.status === "APPROVED") {
            return { error: "Claim is already completed." };
        }

        if (status === "DECLINED" && currentClaim.status === "DECLINED") {
            return { error: "Claim is already declined." };
        }

        if (status === "DECLINED" && currentClaim.status === "APPROVED") {
            return { error: "Invalid action, the claim intent is already approved." }
        }

        if (status === "APPROVED" && currentClaim.status === "DECLINED") {
            return { error: "Invalid action, the claim intent is already declined." }
        }

        const agrichange = await prisma.agriChange.findUnique({
            where: { id: agrichangeId }
        })

        if (!agrichange) return { error: "No item found!" }

        const processClaim = await prisma.claim.update({
            data: { status },
            where: { id: currentClaim.id }
        })

        if (status === "APPROVED") {

            // if (processClaim) {
            //     await prisma.user.update({
            //         data: {
            //             points: claimer.points - points
            //         },
            //         where: { id: claimer.id }
            //     })
            // }

            const totalPoints = points * currentClaim.quantity

            await prisma.transaction.create({
                data: {
                    type: "CLAIM",
                    points: totalPoints,
                    userId: claimer.id,
                    itm: currentClaim.itm,
                }
            })

            await prisma.notification.create({
                data: {
                    userId: claimer.id,
                    type: "COMPLETED",
                }
            })

            revalidatePath("/transactions")
            return { success: "Approved the claim intent." }
        }

        if (status === "DECLINED") {

            // TODO: CREATE TRANSACTION FOR CANCELLED DONATIONS CAN EVEN IMPLEMENT PENALTY WHEREIN USERS CAN RECEIVE MINUS LOYALTY POINTS

            // magccreate pa rin ng transaction pero cancelled at walang maggain na points?


            // await prisma.agriChange.update({
            //     where: { id: agrichange.id },
            //     data: {
            //         quantity: {
            //             increment: quantity
            //         }
            //     }
            // })

            // ibalik yung onhold points if declined
            await prisma.user.update({
                data: {
                    points: claimer.points + points * currentClaim?.quantity
                },
                where: { id: claimer.id }
            })

            //ibalik yung stocks nung product na inorder dahil cancelled naman
            await prisma.agriChange.update({
                where: { id: agrichange.id },
                data: {
                    quantity: {
                        increment: currentClaim?.quantity
                    }
                }
            })

            await prisma.notification.create({
                data: {
                    userId: claimer.id,
                    type: "CANCELLED",
                }
            })

            revalidatePath("/transactions")
            return { success: "Cancelled the claim intent" }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

export const fetchAgrichange = async () => {
    try {
        const session = await auth()

        if (!session) return { error: "Unauthorized!" }

        const agrichange = await prisma.agriChange.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return agrichange
    } catch (error: any) {
        throw new Error(error)
    }
}