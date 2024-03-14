import React from 'react'
import SelectSort from './_components/SelectSort'
import Category from './_components/Category'
import prisma from '@/lib/db'

async function page() {

 
  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
      <div className='flex'>
        <div className='flex items-center'>
          <h1>Sort by:</h1>
          <SelectSort/>
        </div>
      
      </div>
      <div className='mt-5 w-full'>
        
      <Category />
      </div>
    </div>
  )
}

export default page