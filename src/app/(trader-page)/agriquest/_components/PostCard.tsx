'use client'
import {
    Card,
    CardContent,
  } from "@/components/ui/card"
import Image from "next/image"
import ExchangeDialog from "./ExchangeDialog"
import { useState } from "react"
import { Agriquest } from "../_types"

function PostCard({
    post
}:{
    post: Agriquest
}) {

    const [selectedItem, setSelectedItem] = useState<Agriquest>()

  return (
    <Card className="py-5 hover:shadow-green-600 shadow-md hover:right-1 ring-green-400">
        <div className="w-full border-y border-y-gray-100">
            <Image 
                src={post.image}
                alt={post.name}
                width={100}
                height={160}
                className="w-full max-h-52 min-h-52 h-1/2 object-contain"
            />    
        </div>
        <CardContent className="mt-3">
            <div className="flex items-center justify-between">
                <h1>{post.name}</h1>
                <div className='flex just-center items-center px-3 text-green-500 bg-slate-300 cursor-pointer hover:text-white py-3 rounded-full hover:bg-green-500'>
                    <ExchangeDialog selectedItem={post}/>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default PostCard