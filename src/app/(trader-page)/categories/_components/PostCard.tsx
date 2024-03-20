import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from "next/image"
import { Post } from "../../agrifeed/_components/_types"
import { LiaExchangeAltSolid } from "react-icons/lia"
import { FaLeaf } from "react-icons/fa"
import Link from "next/link"

function PostCard({
    post
}:{
    post: Post
}) {
  return (

    <Card className="py-5 hover:shadow-green-600 shadow-md hover:right-1 ring-green-400">
       
        <div className="flex justify-center text-white w-20 gap-3 bg-green-400 rounded-full items-center">
            <FaLeaf />
            <h1>100</h1>
        </div>
        <div className="w-full border-y border-y-gray-100">
            <Image 
                src={post.image}
                alt={post.name}
                width={100}
                height={160}
                className="w-full object-contain"
            />    
        </div>
        <CardContent className="mt-3">
            <div className="flex items-center justify-between">
                <h1>{post.name}</h1>
                <div className='flex just-center items-center px-3 text-green-500 bg-slate-300 cursor-pointer hover:text-white py-3 rounded-full hover:bg-green-500'>
                <span ><LiaExchangeAltSolid /></span>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default PostCard