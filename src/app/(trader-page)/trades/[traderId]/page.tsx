import { TradeWithTradeeTraders } from '@/lib/types'
import React from 'react'
import { SingleTrade } from '../_components/SingleTrade'
import { singleTrade } from '../../../../../actions/trade'
import { PageNF } from '@/components/not-found'

interface TradeParamsProps {
    params: {
        traderId: string
    }
}

const page = async ({ params }: TradeParamsProps) => {

    const trade = await singleTrade(params.traderId)

    if (!trade) {
        // Render the "not found" page or component
        return <PageNF />
    }

    return (
        <div className='mt-[64px] sm:mt-[28px] md:mt-[13px] lg:mt-[0px]'>
            <SingleTrade trade={trade as TradeWithTradeeTraders} />
        </div>
    )
}

export default page