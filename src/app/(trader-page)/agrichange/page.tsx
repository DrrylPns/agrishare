import React from 'react'
import SelectSort from './_components/SelectSort'
import Category from './_components/Category'
import prisma from '@/lib/db'

async function page() {


  return (
    <div className='w-full sm:w-3/5 px-5 sm:px-0 mt-10 sm:mt-0'>
      <div className='mt-5 w-full'>
        <h1 className='block md:hidden mb-5 text-center font-semibold font-livvic text-xl'>Agrichange</h1>
        <Category />
      </div>
    </div>
  )
}

export default page