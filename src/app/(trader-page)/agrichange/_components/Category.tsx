'use client'
import { formattedCategory } from "@/lib/utils";
import { RadioGroup } from "@headlessui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { IoIosAddCircleOutline, IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';
import { Agrichange } from "../../agrifeed/_components/_types";
import PostCard from "./PostCard";
import Link from "next/link";
import { PostCardSkeleton } from "./skeleton/PostCardSkeleton";

const Categories = [
    'FRESH_FRUIT',
  'VEGETABLES',
  'TOOLS',
  'EQUIPMENTS',
  'SEEDS',
  'SOILS',
  'FERTILIZER',
   
  ]

function Category({

}:{

}) {
    const [selectedCategory, setSelectedCategory] = useState<string>(Categories[0])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [post, setPost] = useState<Agrichange[]>()

   useEffect(()=>{
    getPostByCategory()
  
   },[selectedCategory])

   const getPostByCategory = async () => {
    try {
        const res = (await axios.post('/api/getAgrichangePost',{category: selectedCategory})).data;
        setPost(res)
        setIsLoading(false)
    } catch (error) {
        console.log(error)
    }
   }
 
  return (
    <>
   
    <div className='grid grid-cols-12 w-full gap-x-2 '>
    <h1 className="text-right col-span-9">{post?.length} Results found</h1>
        <div className='grid grid-cols-3 w-full  gap-3 col-span-9 '>
          {isLoading && (
            <PostCardSkeleton/>
          )}
          {post && post.length > 0 ? post.map((item)=>(
              
            <PostCard post={item} key={item.id}/>

          )) :(
            <>
              No Items found
            </>
          )
        
          }
        </div>
        <div className='col-span-3 '>
            <RadioGroup value={selectedCategory} onChange={setSelectedCategory} className="shadow-md drop-shadow-md p-5">
                      <RadioGroup.Label className="text-lg font-semibold">All Categories:</RadioGroup.Label>
                      {Categories.map((category) => (
                        <RadioGroup.Option key={category} value={category} className={`flex ml-5 mt-3 items-center gap-4 text-xl font-poppins`}>
                           {({ checked }) => (
                            <>
                            <span className={`${checked && 'text-green-400'} text-lg`}>
                              {checked ? <IoIosRadioButtonOn  /> : <IoIosRadioButtonOff /> }
                            
                            </span>
                            {formattedCategory(category)}
                            </>
                            )}
                        </RadioGroup.Option>
                      ))}
            </RadioGroup>
        </div>
    </div>
    </>
  )
}

export default Category