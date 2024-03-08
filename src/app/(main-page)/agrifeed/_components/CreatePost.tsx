import { Button } from '@/components/ui/button'
import { LucideImagePlus } from 'lucide-react'
import React from 'react'

function CreatePost() {
  return (
    <div className='w-full px-10 py-5 border-2 border-gray-700 rounded-3xl'>
        <h1 className='text-gray-300 text-lg'>Whats on your farm?</h1>
        <div className='flex mt-16 justify-between items-center border-t-2 pt-5 border-gray-300'>
            <Button variant={'default'} className='flex gap-3 w-36 py-2 rounded-2xl'>
                <span><LucideImagePlus /></span>
                <span>Upload</span>
            </Button>
            <Button variant={'default'} className='w-36  py-2 rounded-2xl'>
                Post
            </Button>
        </div>
    </div>
  )
}

export default CreatePost