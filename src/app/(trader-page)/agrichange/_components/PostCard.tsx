'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from "next/image"
import { Agrichange, Post } from "../../agrifeed/_components/_types"
import { LiaExchangeAltSolid } from "react-icons/lia"
import { FaLeaf } from "react-icons/fa"
import Link from "next/link"
import ExchangeDialog from "./ExchangeDialog"
import { useState } from "react"

function PostCard({
    post
}:{
    post: Agrichange 
}) {

    const [selectedItem, setSelectedItem] = useState<Agrichange>()

  return (
    <Card className="py-3 md:py-5 hover:shadow-green-600 shadow-md hover:right-1 ring-green-400">
       
        <div className="text-white px-3 gap-3 text-center bg-green-400 rounded-full w-2/5">
            <h1>{post.pointsNeeded}</h1>
        </div>
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
                <h1 className="text-xs md:text-sm">{post.name} <span>x{post.quantityPerTrade}</span></h1>
                <div className='flex just-center items-center  p-3 text-green-500 bg-slate-300 cursor-pointer hover:text-white rounded-full hover:bg-green-500'>
                    <ExchangeDialog selectedItem={post}/>
                </div>
            </div>
            <h1 className="text-xs text-gray-400">Remaining quantity: {post.quantity}</h1>
        </CardContent>
    </Card>
  )
}

export default PostCard