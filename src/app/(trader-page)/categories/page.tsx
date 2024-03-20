import React from 'react'
import Category from './_components/Category'
import SelectSort from './_components/SelectSort'
import { useSession } from 'next-auth/react'
import { RoleBasedRender } from '@/components/RolebasedRender'

function page() {
 
  return (
    <RoleBasedRender traderFallback={<div className='w-full sm:w-3/5 mt-5 sm:mt-0'>Unauthorized! You are not a trader</div>}>
    <div  className='w-full sm:w-3/5 mt-5 sm:mt-0'>
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
  </RoleBasedRender>
  )
}

export default page