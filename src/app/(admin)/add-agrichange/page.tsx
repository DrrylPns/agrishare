import AdminTitle from '@/components/AdminTitle'
import React from 'react'
import { AgrichangeForm } from './_components/AgrichangeForm'
import { Card } from '@/components/ui/card'


const page = () => {
  return (
    <div className='h-full'>
      <AdminTitle entry='5' title='Agrichange' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11">
        <AgrichangeForm />
      </Card>
    </div>
  )
}

export default page