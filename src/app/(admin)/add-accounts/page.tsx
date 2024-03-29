import AdminTitle from '@/components/AdminTitle'
import React from 'react'
import { UrbanRegister } from './_components/UrbanRegister'
import { Card } from '@/components/ui/card'

const page = () => {
  return (
    <div className='h-full'>
      <AdminTitle entry='3' title='Urban Farmer Info' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg p-6">
        <UrbanRegister />
      </Card>
    </div>
  )
}

export default page