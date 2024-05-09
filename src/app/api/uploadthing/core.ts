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
  changeAvatar: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(middleware)
    .onUploadComplete(async (data) => { }),
  pdfUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(async ({ metadata, file }) => { }),
  videoUploader: f({ video: { maxFileSize: '32MB' } })
    .middleware(middleware)
    .onUploadComplete(async ({ metadata, file }) => { }),
  imageCarousel: f({ image: { maxFileSize: '16MB', maxFileCount: 5 } })
    .middleware(middleware)
    .onUploadComplete(async ({ metadata, file }) => { }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter