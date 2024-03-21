
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import React from 'react'
import { TradeIntents } from './_components/TradeIntents'
import { fetchTradeByUser } from '../../../../actions/trade'
import { TradeWithTradeeTraders } from '@/lib/types'

const TradesPage = async () => {

    const trades = await fetchTradeByUser()

    return (
        <div className='mt-[64px] sm:mt-[28px] md:mt-[13px] lg:mt-[0px]'>
            <TradeIntents trades={trades as TradeWithTradeeTraders[]} />
        </div>
    )
}

export default TradesPage