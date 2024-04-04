'use client'
import {
    Card,
    CardContent,
  } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { Post } from "../../agrifeed/_components/_types"
import { LiaExchangeAltSolid } from "react-icons/lia"
import Link from "next/link"

function PostCard({
    post
}:{
    post: Post 
}) {

    const [selectedItem, setSelectedItem] = useState<Post>()

  return (
    <Link href={`/agrifeed/${post.id}`} className="">
    <Card className="py-3 md:py-5 hover:shadow-green-600 shadow-md hover:right-1 ring-green-400">
       
        <div className="w-full border-y border-y-gray-100">
            <Image 
                src={post.image}
                alt={post.name}
                width={100}
                height={160}
                className="w-full object-contain h-36"
            />    
        </div>
        <CardContent className="mt-3">
            <div className="flex items-center justify-between">
                <h1 className="text-xs md:text-sm">{post.name}</h1>
                <div className='flex just-center items-center  p-3 text-green-500 bg-slate-300 cursor-pointer hover:text-white rounded-full hover:bg-green-500'>
                    <span ><LiaExchangeAltSolid /> </span>
                </div>
            </div>
        </CardContent>
    </Card>
    </Link>
  )
}

export default PostCard