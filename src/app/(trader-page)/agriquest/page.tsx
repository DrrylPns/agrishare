import { RoleBasedRender } from '@/components/RolebasedRender'
import React from 'react'

function page() {
  return (
    <RoleBasedRender traderFallback={<div className='w-full sm:w-3/5 mt-5 sm:mt-0'>Unauthorized! You are not a trader</div>}>
      <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
          Agriquest
      </div>
    </RoleBasedRender>
  )
}

export default page