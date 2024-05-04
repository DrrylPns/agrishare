import AdminTitle from '@/components/AdminTitle'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import AgrimapsForm from './_components/AgrimapsForm'
import prisma from '@/lib/db';;
import { UrbanFarmList } from './_components/UrbanFarmList';

const AddAgrimapsPage = async () => {
    const coordinates = await prisma.coordinates.findMany();
    
    return (
        <div className='h-full'>
            <AdminTitle entry='7' title='Agrimaps' />
            <Card className='mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11'>
                <AgrimapsForm />
            </Card>

            <AdminTitle entry='8' title='List of Urban Farms' />
            <Card className='mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11'>
                <UrbanFarmList coordinates={coordinates} />
            </Card>
        </div>
    )
}

export default AddAgrimapsPage