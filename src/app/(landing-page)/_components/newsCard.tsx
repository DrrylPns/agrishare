import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from 'next/image';
import defaultImage from './images/FruitsandVeges.png'
import { FiTag } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';
import { MdOutlineModeComment } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { BsArrowRight } from 'react-icons/bs';
  

function NewsCard({

  category, 
  userRole,
  description,
  image,
  date,
  comments
}:{
  category: string;
  userRole: string;
  comments: string[];
  description: string;
  image: string;
  date: Date;
}) {
  return (
    <Card className=''>
      <CardHeader className='relative h-[40%]'>
        <Image
        src={image || defaultImage}
        alt=''
        width={100}
        height={100}
        className='w-full h-full '
        />
      </CardHeader>
      <CardContent>
        <div className='flex justify-between items-center gap-3 text-[0.5rem]'>
          <div className='flex items-center gap-1'>
            <FiTag />
            <h1>{category}</h1>
          </div>
          <div className='flex items-center gap-1'>
            <HiOutlineUser />
            <h1>By {userRole}</h1>
          </div>
          <div className='flex items-center gap-1'>
            <MdOutlineModeComment />
            <h1>{comments.length} comments</h1>
          </div>
        </div>
        <div className='h-5'> 
          <p className='line-clamp-2 text-xs mt-2 max-h-90'>{description}</p>
        </div>
        
      </CardContent>
      <CardFooter>
      <Button variant={"ghost"} className='relative text-[0.7rem] font-semibold text-primary-green'>Read More!<span className='ml-2 text-lg'><BsArrowRight /></span></Button>
      </CardFooter>
    </Card>
  )
}

export default NewsCard