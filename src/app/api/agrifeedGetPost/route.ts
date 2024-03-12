import prisma from "@/lib/db";

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const param = searchParams.get("cursor");
        const limit = 5
        const getAllPost = await prisma.post.findMany({
           cursor: param ?{
            id:param
           }: undefined,
           take: limit,
           skip: param === '' ? 0 : 1,
            include: {
                reviews: true,
                User: true,
            },
            orderBy: {
                createdAt: 'desc'
            },

        })
        const myCursor = getAllPost.length === limit ? getAllPost[getAllPost.length - 1].id : undefined;
        return new Response(JSON.stringify({getAllPost, nextId: myCursor}))
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error:', error }))
    }
}