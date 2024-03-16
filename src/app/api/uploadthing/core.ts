import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '../../../../auth'

const f = createUploadthing()

const middleware = async () => {
    const session = await auth()

    if (!session || !session.user) throw new Error('Unauthorized')

    return { id: session.user.id }
}

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: '4MB' } })
        .middleware(middleware)
        .onUploadComplete(async ({ metadata, file }) => { }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter