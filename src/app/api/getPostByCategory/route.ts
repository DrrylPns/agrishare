import prisma from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { category, sort } = body

        if (sort === 'Transaction') {
            const postByCtegory = await prisma.post.findMany({
                where:{
                    category
                },
                orderBy: {
                    transaction: {
                        _count: 'desc'
                    }
                }
            })
            return new Response(JSON.stringify(postByCtegory))
        }
        if (sort === 'Latest') {
            const postByCtegory = await prisma.post.findMany({
                where:{
                    category,
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