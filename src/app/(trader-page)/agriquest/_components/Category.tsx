'use client'
import { formattedCategory } from "@/lib/utils";
import { RadioGroup } from "@headlessui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { IoIosAddCircleOutline, IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';
import { Post } from "../../agrifeed/_components/_types";
import PostCard from "./PostCard";
import Link from "next/link";
import PaginationSection from "@/components/PaginationSection";

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
    const [post, setPost] = useState<Post[]>()
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = post?.slice(firstItemIndex, lastItemIndex)

   useEffect(()=>{
    getPostByCategory()
   },[selectedCategory])

   const getPostByCategory = async () => {
    try {
        const res = (await axios.post('/api/getAgrichangePost',{category: selectedCategory})).data;
        setPost(res)
    } catch (error) {
        console.log(error)
    }
   }
 
  return (
    <>
   
    <div className='grid grid-cols-12 w-full gap-x-2 '>
    <h1 className="text-right col-span-9">{post?.length} Results found</h1>
        <div className='grid grid-cols-3 w-full  gap-3 col-span-9 '>
            {post && post.map((item)=>(
                <Link href={`/agrifeed/${item.id}`} key={item.id}>
                    <PostCard post={item} />
                </Link>
            ))}
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
    <PaginationSection
      totalItems={post?.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
    </>
  )
}

export default Category