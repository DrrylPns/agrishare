import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Post } from './_types'
import RelativeDate from '@/components/RelativeDate'
import Image from 'next/image'
import DefaultImage from './images/default-user.jpg'
import { formattedCategory } from '@/lib/utils'

function PostTabs({
  post
}:{
  post: Post
}) {
  return (
    <Tabs defaultValue="account" className="w-full mt-10" >
        <TabsList className='bg-transparent w-full mx-auto'>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="adddtional information">Additional Information</TabsTrigger>
            <TabsTrigger value="feedback">Agritzens Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="description">{post.description}</TabsContent>
        <TabsContent value="adddtional information">
          <div>
            <div className='flex'>
              <h1 className='w-1/3'>Weight:</h1>
              <span className='text-gray-400'>{post.weight}</span>
            </div>
            <div className='flex'>
              <h1 className='w-1/3'>Color: </h1>
              <span className='text-gray-400'>{post.color}</span>
            </div>
           <div className='flex'>
              <h1 className='w-1/3'>Type: </h1>
              <span className='text-gray-400'>{post.type}</span>
           </div>
            <div className='flex'>
              <h1 className='w-1/3'>Category: </h1>
              <span className='text-gray-400'>{formattedCategory(post.category)}</span>
            </div>
            <div  className='flex'>
              <h1 className='w-1/3'>Quantity: </h1>
              <span className='text-gray-400'>{post.quantity}</span>
            </div>
            <div className='flex'>  
              <h1 className='w-1/3'>Shelf Life: </h1>
              <span className='text-gray-400'>{post.shelfLife}</span>
            </div>
            <div className='flex'>
              <h1 className='w-1/3'>Harvest Date: </h1>
              <span className='text-gray-400'><RelativeDate dateString={post.harvestDate.toDateString()}/></span>
            </div>
            <div  className='flex'>
              <h1 className='w-1/3'>Prefered Offers: </h1>
              <span className='text-gray-400'>{post.preferedOffers}</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="feedback">
          {post.reviews.map((review)=>(
            <div className='p-3 rounded-md shadow-md drop-shadow-sm'>
              <div className='flex items-center w-full '>
                <Image 
                  src={review.User.image || DefaultImage} 
                  alt={review.User.name || "username"} 
                  width={40}
                  height={40}
                  className='rounded-full'
                />
                <h1 className='ml-10'>{review.User.name} {review.User.lastName}</h1>
                <h1 className='text-gray-400 ml-auto'> <RelativeDate dateString={review.createdAt.toDateString()}/></h1>
              </div>
              <div className='text-gray-400 mt-3'>
                <p>{review.review}</p>
              </div>
            </div>
          ))}
        </TabsContent>
    </Tabs>
  )
}

export default PostTabs