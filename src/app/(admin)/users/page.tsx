"use client"
import AdminTitle from '@/components/AdminTitle';
import { Card, Grid, } from '@tremor/react';
import { DataTable } from './_components/data-table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '@prisma/client';
import { columns } from './_components/columns';

const page = () => {

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get("/api/getUsers")
      return data as User[]
    }
  })

  return (
    <div className=''>
      <AdminTitle entry='2' title='List of Users' />

      <Card className="mx-auto max-w-full h-full drop-shadow-lg">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
          </div>
          <DataTable data={users ?? []} columns={columns} />
        </div>
      </Card>
    </div>
  )
}

export default page