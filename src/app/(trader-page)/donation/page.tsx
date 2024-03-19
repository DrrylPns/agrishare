import prisma from '@/lib/db'
import React from 'react'
import CommunityCard from './_components/CommunityCard'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Front from './_components/images/front.png'
import Back from './_components/images/back.png'
import Link from 'next/link'

async function Page() {

  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
      <h1 className='text-center font-semibold text-2xl'>Donate</h1>
      <div className='grid sm:grid-cols-2 gap-5 bg-green-100 p-10'>
        <div className='font-poppins w-full'>
          <h1 className='text-lg sm:text-4xl font-semibold'>Deed of Donation</h1>
          <h3 className='text-green-500 font-poppins font-medium my-5'><span className='t text-violet-500'>C</span>enter of <span className='text-violet-500'>U</span>rban <span className='text-violet-500'>A</span>griculture and Innovation</h3>
          <h3 className='font-poppins uppercase text-sm font-semibold mb-5'>Know all men by these presents:</h3>
          <p className='leading-7 text-lg'>That the <span className='font-semibold'>QUEZON CITY UNIVERSITY - CENTER FOR URBAN AGRICULTURE AND INNOVATION</span> in partnership with <span className='font-semibold'>JOY OF URBAN FARMING (JoUF) and PUBLIC EMPLOYEMENT OFFICE SERVICE</span> hereby donates the herein - identified items to the </p>         
          <Link href={'/donation/form'} className='text-center w-full'>
            <Button variant={'default'} className='w-1/2 h-20 text-center text-xl tracking-wider font-semibold my-10'>Donate now</Button>
          </Link>
        </div>
        <div className='w-full '>
          <Image 
            src={Back} 
            alt='Image'
            width={100}
            height={400}  
            className='ml-auto w-[60%]'
          />
          <Image 
            src={Front} 
            alt='Image'
            width={100}
            height={400}  
            className='mt-[-5rem] mr-auto w-[60%] shadow-md z-20'
          />
        </div>
        
      </div>
      
    </div>
  )
}

export default Page