import prisma from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { category, sort } = body

        if (sort === 'Transaction') {
            const postByCtegory = await prisma.agriquest.findMany({
                where: {
                    category,
                    quantity: {
                        not: {
                            equals: 0
                        }
                    }
                },
                orderBy: {
                    claimedBy: {
                        _count: 'desc'
                    }
                }
            })
            return new Response(JSON.stringify(postByCtegory))
        }
        if (sort === 'Latest') {
            const postByCtegory = await prisma.agriquest.findMany({
                where: {
                    category,
                    quantity: {
                        not: {
                            equals: 0
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return new Response(JSON.stringify(postByCtegory))
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error:', error }))
    }
}