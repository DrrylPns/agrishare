import React from 'react'
import { AgriMaps } from './_components/AgriMaps'
import prisma from '@/lib/db';

async function page() {
  const agrimaps = await prisma.coordinates.findMany();
  return (
    <div className='w-full md:w-3/5 mt-5 sm:mt-0'>
      <AgriMaps coordinates={agrimaps} />
    </div>
  )
}

export default page