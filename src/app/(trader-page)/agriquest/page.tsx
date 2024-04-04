import { RoleBasedRender } from '@/components/RolebasedRender'
import React from 'react'
import SelectSort from './_components/SelectSort'
import Category from './_components/Category'

function page() {
  return (
    <RoleBasedRender traderFallback={<div className='w-full sm:w-3/5 mt-5 sm:mt-0'>Unauthorized! You are not a trader</div>}>
      <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
        
        <div className='mt-5 w-full'>
          
        <Category />
        </div>
      </div> 
    </RoleBasedRender>
  )
}

export default page