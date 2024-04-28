import AdminTitle from "@/components/AdminTitle"
import { Card } from "@/components/ui/card"
import { auth } from "../../../../auth"
import prisma from "@/lib/db"
import { AccountSettings } from "@/app/(trader-page)/settings/_components/AccountSettings"
import { User } from "@prisma/client"
import { PasswordSettings } from "@/app/(trader-page)/settings/_components/PasswordSettings"

const AdminSettingsPage = async () => {
    const session = await auth()

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user.id
        }
    })
    return (
        <div className="h-full">
            <AdminTitle entry='1' title='Admin Settings' />

            <Card className="mx-auto max-w-full h-full drop-shadow-lg p-6 mb-11">
                <AccountSettings user={user as User} />
                <PasswordSettings user={user as User} />
            </Card>
        </div>
    )
}

export default AdminSettingsPage