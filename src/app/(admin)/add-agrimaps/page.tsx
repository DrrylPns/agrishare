import AdminTitle from '@/components/AdminTitle'
import { Card } from '@/components/ui/card'
import AgrimapsForm from './_components/AgrimapsForm'

const AddAgrimapsPage = () => {
    return (
        <div className='h-full'>
            <AdminTitle entry='7' title='Agrimaps' />

            <Card className='mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11'>
                <AgrimapsForm />
            </Card>
        </div>
    )
}

export default AddAgrimapsPage