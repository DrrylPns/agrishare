'use client'
import { formattedCategory } from "@/lib/utils";
import { Listbox, RadioGroup, Transition } from "@headlessui/react"
import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { IoIosAddCircleOutline, IoIosArrowDown, IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';
import { Agrichange } from "../../agrifeed/_components/_types";
import PostCard from "./PostCard";
import { PostCardSkeleton } from "./skeleton/PostCardSkeleton";
import PaginationSection from "@/components/PaginationSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BeatLoader } from "react-spinners";



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
    const [post, setPost] = useState<Agrichange[]>()
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
        const res = await axios.post('/api/getAgrichangePost', {
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
    <div className='flex justify-between'>
      <div className='relative flex flex-col md:flex-row md:items-center justify-around'>
        <h1 className="text-xs sm:text-sm mr-2 sm:mr-5">Sort by:</h1>
        <Listbox value={selectedSort} onChange={setSelectedSort}>
          <Listbox.Button className={'relative w-28 sm:w-40 py-1 md:py-3 text-xs md:text-lg rounded-md flex items-center justify-around bg-white shadow-md ui-open::ring-2 ring-black'}>{selectedSort} <IoIosArrowDown /></Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-10 sm:top-14 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <Listbox.Option
                  value={'Latest'}
                  className='relative cursor-default select-none py-2 px-2 md:pl-10 md:pr-4 text-xs md:text-lg hover:bg-slate-100 text-gray-900'
                >
                  Latest
                </Listbox.Option>
                <Listbox.Option
                  value={'Transaction'}
                  className='relative cursor-default select-none py-2 px-2 md:pl-10 md:pr-4 text-xs md:text-lg hover:bg-slate-100 text-gray-900'
                >
                  Transaction
                </Listbox.Option>
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
      <div className='md:hidden relative flex flex-col md:flex-row md:items-center justify-around'>
        <h1 className="text-xs sm:text-sm mr-2 sm:mr-5">All Categories:</h1>
        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
          <Listbox.Button className={'relative w-28 sm:w-40 py-1 md:py-3 bg-green-400 text-white tracking-wider text-xs md:text-lg rounded-md flex items-center justify-around shadow-md ui-open::ring-2 ring-black'}>{formattedCategory(selectedCategory)} <IoIosArrowDown /></Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-10 sm:top-14 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {Categories.map((category)=>(
                    <Listbox.Option
                      value={category}
                      className='relative cursor-default select-none py-2 px-2 md:pl-10 md:pr-4 text-xs hover:bg-slate-100 text-gray-900'
                    >
                    {formattedCategory(category)}
                    </Listbox.Option>
                ))}
                
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    </div>
    <div className='grid grid-cols-12 w-full gap-x-2 '>
      <h1 className="text-right col-span-12 my-3 md:col-span-9 text-[0.6rem] sm:text-sm">{post?.length} Results found</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 w-full  gap-3 col-span-12 sm:col-span-9 '>
          {isLoading ? (
            <div className='w-full flex items-center justify-center'>
              <BeatLoader />
            </div>
          ) : (
          <>
          {currentItems && currentItems.length > 0 ? currentItems.map((item)=>(
            <div key={item.id}>
              {item.quantity < item.quantityPerTrade ? (
                <></>
              ):(
                <PostCard post={item} key={item.id}/>
              )}
           
            </div>
          )) :(
            <>
              No Items found
            </>
          )}
          </>
          )}
        </div>
        <div className='col-span-3 hidden md:block'>
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

