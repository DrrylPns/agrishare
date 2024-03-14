import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { formattedCategory } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import { LiaExchangeAltSolid } from 'react-icons/lia';
import PostTabs from '../_components/PostTabs';
import AddOrSubtractBtn from '../_components/AddOrSubtractBtn';


const Page = async ({
  params,
}: {
  params: { postId: string };
}) => {
  const Post = await prisma.post.findUnique({
    where:{
      id: params.postId
    },
    include:{
      reviews: {
        include:{
          User: true
        },
        orderBy:{
          createdAt: 'desc'
        }
      },
      User: true
    }
  })
  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
      {Post && (
        <>
        <div className='flex justify-around gap-5 mt-5'>
          <Image
              src={Post.image}
              alt={Post.name}
              width={300}
              height={300}
              className=' w-2/5 h-72  object-center border border-gray-300'
          />
          <div className='w-1/2'>
            <h1 className='text-3xl font-medium'>{Post.name}</h1>
            <p className='min-h-24 line-clamp-5 text-ellipsis'>{Post.description}</p>
            <div className='flex gap-3  items-center border-y-2 border-gray-300 py-5'>
                <AddOrSubtractBtn/>
                <Button variant={'default'} className='rounded-full w-2/5'>
                    Trade
                    <span className='ml-3'><LiaExchangeAltSolid /></span>
                </Button>
            </div>
            <h1 className='text-sm text-gray-700 my-3'>Category: <span className='text-gray-500'>{formattedCategory(Post.category)}</span></h1>
          </div>
        </div>
        <div> 
          <PostTabs post={Post}/>
        </div>
        </>
      )}
    </div>
  )
}

export default Page