'use client'
import React from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { User } from './_types'
import { BeatLoader } from "react-spinners"

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
  shelfLife: string,
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

  if (isLoading) return <div>
    <BeatLoader />
  </div>

  if (isError) return <div>Error fetching posts, try to refresh the page!</div>

  return (
    <div>
      {Posts?.pages.length > 0 ? Posts?.pages.map((page) => (
        <div key={page.nextId} >
          {page.getAllPost !== undefined && page.getAllPost.map((product) => (
            <div key={product.id} className='mb-3'>
              <ProductCard
                key={product.id}
                id={product.id}
                user={product.User.name}
                lastName={product.User.lastName}
                productImage={product.image}
                productName={product.name}
                description={product.description}
                category={product.category}
                status={product.status}
                reviews={product.reviews}
              />
            </div>
          ))}

        </div>
      )) : (
        <>
        </>
      )}
    </div>
  )
}

export default Products