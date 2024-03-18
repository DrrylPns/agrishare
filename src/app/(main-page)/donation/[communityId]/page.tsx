import prisma from '@/lib/db'
import Image from 'next/image'
import React from 'react'
import DefaultImage from '@/../public/images/default-user.jpg'
import RelativeDate from '@/components/RelativeDate'

async function Page({
    params
}:{
    params: {
        communityId: string
    }
}) {

    const Community = await prisma.community.findUnique({
        where: {
            id: params.communityId
        },
        include:{
            donations: {
             include:{
               donator: true
             }
            }
        }
    })
  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
        <h1 className='text-center font-semibold text-2xl'>Donate</h1>
        {Community && (
            <div className=''>
                <h1>{Community.title}</h1>
                <Image 
                    src={Community.thumbnail}
                    alt='thumbnail'
                    height={200}
                    width={100}
                    className='object-contain w-full'
                />
                <div className='flex items-center'>
                    <Image
                        src={Community.communityImage || DefaultImage}
                        alt='community Image'
                        className='object-contain rounded-full'
                    />
                    <h1>{Community.name}</h1>
                    <RelativeDate dateString={Community.createdAt.toDateString()}/>
                </div>
            </div>
        )}
       
    </div>
  )
}

export default Page