import { AccountSettings } from "./_components/AccountSettings"
import { TraderAddress } from "./_components/TraderAddress"
import { PasswordSettings } from "./_components/PasswordSettings"

import prisma from "@/lib/db"
import { User } from "@prisma/client"
import { auth } from "../../../../auth"

const SettingsPage = async () => {
    const session = await auth()

    const user = await prisma.user.findFirst({
        where: {
            id: session?.user.id
        }
    })

    if (!user) return <>Error Fetching User</>

    return (
        <main className="mt-[60px] sm:mt-0 lg:mr-[300px]">
            {/* Account Settings */}
            <AccountSettings user={user as User} />

            {/* Trader Address */}
            {user?.role === "TRADER" && (
                <TraderAddress user={user as User} />
            )}

            {/* Change Password */}
            <PasswordSettings user={user as User} />
        </main>
    )
}

export default SettingsPage