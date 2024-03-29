import AdminTitle from '@/components/AdminTitle'
import { Card } from '@/components/ui/card'
import { AgriquestForm } from './_components/AgriquestForm'

const AgriQuestPage = () => {
    return (
        <div className='h-full'>
            <AdminTitle entry='6' title='Agriquest' />

            <Card className="mx-auto max-w-full h-full drop-shadow-lg p-6">
                <AgriquestForm />
            </Card>
        </div>
    )
}

export default AgriQuestPage