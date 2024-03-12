import AdminTitle from '@/components/AdminTitle'
import { Card } from '@tremor/react'
import React from 'react'
import { UrbanRegister } from './_components/UrbanRegister'

const page = () => {
  return (
    <div className='h-full'>
      <AdminTitle entry='3' title='Urban Farmer Info' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg">
        <UrbanRegister />
      </Card>
    </div>
  )
}

export default page