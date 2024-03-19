import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
import { formattedCategory } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import { LiaExchangeAltSolid } from 'react-icons/lia';
import PostTabs from '../_components/PostTabs';
import AddOrSubtractBtn from '../_components/AddOrSubtractBtn';
import { fetchPost } from '../../../../../actions/fetchPost';
import { PostSingle } from '../_components/PostSingle';


const Page = async ({
  params,
}: {
  params: { postId: string };
}) => {
  const Post = await fetchPost(params.postId)

  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
      {Post && (
        <PostSingle post={Post} />
      )}
    </div>
  )
}

export default Page