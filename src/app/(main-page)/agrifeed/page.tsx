import Image from 'next/image'
import React from 'react'
import Agrifeed from './_components/images/Agrifeed.png'
import CreatePost from './_components/CreatePost'


const page = () => {
    return (
        <div className='w-full sm:w-3/5 mt-5 sm:mt-0'>
            <Image
                src={Agrifeed}
                alt='Agrifeed Logo'
                className='h h-32 md:w-[40%] mx-auto'
            />
            <div className='w-full'>
                <CreatePost/>
            </div>
        </div>
    )
}

export default page