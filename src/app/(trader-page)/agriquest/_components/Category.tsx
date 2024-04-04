'use client'
import { formattedCategory } from "@/lib/utils";
import { Listbox, RadioGroup, Transition } from "@headlessui/react"
import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { IoIosAddCircleOutline, IoIosArrowDown, IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';
import { Agrichange } from "../../agrifeed/_components/_types";
import PostCard from "./PostCard";
import PaginationSection from "@/components/PaginationSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PostCardSkeleton } from "./skeleton/PostCardSkeleton";
import { Agriquest } from "../_types";



const Categories = [
    'FRESH_FRUIT',
  'VEGETABLES',
  'TOOLS',
  'EQUIPMENTS',
  'SEEDS',
  'SOILS',
  'FERTILIZER',
   
  ]

export default function Category({

}:{

}) {
    const [selectedCategory, setSelectedCategory] = useState<string>(Categories[0])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [post, setPost] = useState<Agriquest[]>()
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [selectedSort, setSelectedSort] = useState<string>('Latest');

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = post?.slice(firstItemIndex, lastItemIndex)

    useEffect(() => {
      getPostsByCategory();
  }, [selectedCategory, selectedSort]); 

   const getPostsByCategory = async () => {
    setIsLoading(true);
    try {
        const res = await axios.post('/api/getAgriquestPost', {
            category: selectedCategory,
            sort: selectedSort 
        });
        setPost(res.data);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
}

  return (
    <>
    <div className='flex'>
      <div className='relative flex items-center justify-around'>
        <h1 className="mr-5">Sort by:</h1>
        <Listbox value={selectedSort} onChange={setSelectedSort}>
          <Listbox.Button className={'relative w-40 py-3 text-lg rounded-md flex items-center justify-around bg-white shadow-md ui-open::ring-2 ring-black'}>{selectedSort} <IoIosArrowDown /></Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-14 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option
                  value={'Latest'}
                  className='relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900'
                >
                  Latest
                </Listbox.Option>
                <Listbox.Option
                  value={'Transaction'}
                  className='relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900'
                >
                  Transaction
                </Listbox.Option>
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    </div>
    <div className='grid grid-cols-12 w-full gap-x-2 '>
    <h1 className="text-right col-span-9">{post?.length} Results found</h1>
        <div className='grid grid-cols-3 w-full  gap-3 col-span-9 '>
          {isLoading ? (
            <PostCardSkeleton/>
          ) : (
          <>
          {currentItems && currentItems.length > 0 ? currentItems.map((item)=>(
            <PostCard post={item} key={item.id}/>
          
          )) :(
            <>
              No Items found
            </>
          )}
          </>
          )}
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
};

