import React from 'react'

interface AdminTitleProps {
    entry: string;
    title: string;
}

const AdminTitle = ({entry, title}: AdminTitleProps) => {
    return (
        <div className='my-5 flex flex-row items-center gap-3'>
            <div className='bg-primary-green rounded-full w-[34px] h-[34px] text-center flex items-center justify-center text-white'>{entry}</div>
            <h1 className='text-[#1C2A53] text-xl font-semibold'>{title}</h1>
        </div>
    )
}

export default AdminTitle