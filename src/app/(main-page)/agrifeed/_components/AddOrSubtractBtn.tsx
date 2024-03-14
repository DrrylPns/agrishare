'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function AddOrSubtractBtn() {
  const [number , setNumber] = useState<number>(0)
  return (
    <div className='w-1/3 flex items-center justify-evenly '>
        <Button variant={'secondary'}
          onClick={()=>{setNumber(prev => prev - 1)}}
        >
        -
        </Button>
        <h1 className='px-3'>{number}</h1>
        <Button variant={'secondary'}
          onClick={()=>{setNumber(prev => prev + 1)}}
        >
        +
        </Button>
    </div>
  )
}

export default AddOrSubtractBtn