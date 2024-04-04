import Image from 'next/image'
import React from 'react'
import Agrifeed from './_components/images/Agrifeed.png'
import CreatePost from './_components/CreatePost'
import Products from './_components/Products'
import { RoleBasedRender } from '@/components/RolebasedRender'


const page = () => {
    return (
        <RoleBasedRender traderFallback={<div className='w-full sm:w-3/5 mt-5 sm:mt-0'>Unauthorized! You are not a trader</div>}>
        <div className='w-full sm:w-3/5 mt-10 sm:mt-0'>
            <Image
                src={Agrifeed}
                alt='Agrifeed Logo'
                className='h h-32 md:w-[40%] mx-auto'
            />
            <div className='w-full px-5 sm:px-0 mb-5 sm:mb-10'>
                <CreatePost />
            </div>
            <Products />
        </div>
        </RoleBasedRender>
    )
}

export default page