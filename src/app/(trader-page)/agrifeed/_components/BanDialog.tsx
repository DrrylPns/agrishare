"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { LucideImagePlus } from 'lucide-react'
import React, { useState } from 'react'

function BanDialog({
    banUntil
}:{
    banUntil:Date| null
}) {
    const [open, setOpen] = useState(false)
  return (
    <div className='w-full px-5 sm:px-10 py-5 border border-gray-700 rounded-3xl'>
      <h1 className='text-gray-300 text-lg'>Whats on your farm?</h1>
      <div className='flex text-[0.6rem] sm:text-sm mt-10 sm:mt-16 justify-between items-center border-t-2 pt-5 border-gray-300'>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='bg-[#00B207] hover:bg-[#00B207]/80 text-white w-1/3 sm:w-36 h-10 py-2 rounded-2xl flex items-center justify-center'>
                <span><LucideImagePlus /></span>
                <span>Upload</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>You are currently ban from creating a post</DialogTitle>
                    <DialogDescription>
                        You are can't create post until {banUntil !== null && formatDate(banUntil.toString())}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>   
        </div>
    </div >
  )
}

export default BanDialog