'use client'
import React, { useEffect, useRef } from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from "react-intersection-observer";
import { User } from './_types'
import { BeatLoader } from "react-spinners"
import { isExpired } from '@/lib/utils'

type ProductPostType = {
  getAllPost: ProductType[],
  nextId: string
}

type ProductType = {
  id: string,
  image: string,
  name: string,
  lastName: string;
  description: string,
  quantity: number,
  weight: number,
  color: string,
  type: "ORGANIC" | "INORGANIC",
  isFavorite: boolean,
  category: "FRESH_FRUIT" | "VEGETABLES" | "TOOLS" | "EQUIPMENTS" | "SEEDS" | "SOILS" | "FERTILIZER",
  status: string,
  shelfLifeDuration: number,
  shelfLifeUnit: string,
  harvestDate: Date,
  reviews: ReviewsType[],
  createdAt: Date,
  updatedAt: Date,
  User: User
}

export type ReviewsType = {
  id: string,
  review: string,
  createdAt: Date,
  updatedAt: Date,
  user: User
}

function Products() {
  const pref = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const { isLoading, isError, data: Posts, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['post'],
    queryFn: async ({ pageParam = '' }) => {
      try {
        const { data } = await axios.get(`/api/agrifeedGetPost?cursor=${pageParam}`);
        return data as ProductPostType;
      } catch (error: any) {
        throw new Error(`Error fetching post: ${error.message}`);
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextId || undefined
  })

  if (isLoading) return <div className='w-full flex items-center justify-center'>
    <BeatLoader />
  </div>

  if (isError) return <div>Error fetching posts, try to refresh the page!</div>

  return (
    <div className='px-5 sm:px-0'>
      {Posts?.pages.length > 0 ? Posts?.pages.map((page) => (
        <div key={page.nextId} >
          {page.getAllPost !== undefined && page.getAllPost.map((product) => {
            if(isExpired(product.harvestDate.toString(), product.shelfLifeDuration , product.shelfLifeUnit)){
              return null
            } else {
            return (
              <div key={product.id} className='mb-3'>
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.User.name}
                  lastName={product.User.lastName}
                  productImage={product.image}
                  productName={product.name}
                  description={product.description}
                  category={product.category}
                  status={product.status}
                  reviews={product.reviews}
                  user={product.User as User}
                />
              </div>
            )}
          })}
          {isFetchingNextPage && (
            <div className='w-full flex items-center justify-center'>
              <BeatLoader />
            </div>
          )}
          <span ref={ref} className="invisible absolute">
            intersection observer marker
          </span>
        </div>
      )) : (
        <>
        </>
      )}
    </div>
  )
}

export default Products