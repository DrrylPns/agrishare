import { RoleBasedRender } from '@/components/RolebasedRender'
import React from 'react'
import SelectSort from './_components/SelectSort'
import Category from './_components/Category'
import prisma from '@/lib/db'
import { auth } from '../../../../auth'

async function page() {
  const session = await auth()
  if (!session) return { error: "Unauthorized!" }

  const userRequest = await prisma.user.findUnique({
    where:{
      id: session.user.id
    }
  })
  return (
    <RoleBasedRender traderFallback={<div className='w-full sm:w-3/5 mt-5 sm:mt-0'>Unauthorized! You are not a trader</div>}>
      <div className='w-full sm:w-3/5 mt-10 px-5 md:px-0 sm:mt-0'>
        <div className='mt-5 w-full'>
          <h1 className='block md:hidden mb-5 text-center font-semibold font-livvic text-xl'>Agriquest</h1>
          <h1 className=' mb-5 text-center font-semibold font-livvic text-xl'>Request left: <span className="">{userRequest?.requestLeft}</span></h1>
          
          <Category />
        </div>
      </div> 
    </RoleBasedRender>
  )
}

export default page