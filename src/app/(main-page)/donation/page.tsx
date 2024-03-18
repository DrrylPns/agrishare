import prisma from '@/lib/db'
import React from 'react'
import CommunityCard from './_components/CommunityCard'

async function page() {

  const Communities = await prisma.community.findMany({
    include:{
     donations: {
      include:{
        donator: true,
        Community: true
      }
     }
    
    }
  })

  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
      <h1 className='text-center font-semibold text-2xl'>Donate</h1>
      {Communities && Communities.map((community)=>(
        <div className='grid grid-cols-3 gap-5' key={community.id}>
          <CommunityCard community={community}/>
        </div>
      ))}
      
    </div>
  )
}

export default page