import prisma from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {category} = body

        const postByCtegory = await prisma.agriChange.findMany({
            where:{
                category,
                status: {
                    not:{
                        equals: 'OUTOFSTOCK'
                    }
                }
            },
        })
        return new Response(JSON.stringify(postByCtegory))
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error:', error }))
    }
}