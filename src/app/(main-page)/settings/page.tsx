import { AccountSettings } from "./_components/AccountSettings"
import { TraderAddress } from "./_components/TraderAddress"
import { PasswordSettings } from "./_components/PasswordSettings"
import { getAuthSession } from "@/lib/auth"
import prisma from "@/lib/db"
import { User } from "@prisma/client"

const SettingsPage = async () => {
    const session = await getAuthSession()

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user.id
        }
    })

    return (
        <main className="mt-[60px] sm:mt-0 lg:mr-[300px]">
            {/* Account Settings */}
            <AccountSettings user={user as User} />

            {/* Trader Address */}
            <TraderAddress user={user as User} />

            {/* Change Password */}
            <PasswordSettings user={user as User} />
        </main>
    )
}

export default SettingsPage