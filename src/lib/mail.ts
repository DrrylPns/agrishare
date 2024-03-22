import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTradeNotification = async (email: string, traderName: string, postName: string, tradeId: string, description: string) => {
    const tradeLink = `${domain}/trades/${tradeId}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Agrishare: ${traderName} has requested a trade to your ${postName}.`,
        html: `<div>
                    <p>${traderName}: ${description}</p>
                    <p>Click <a href="${tradeLink}">here</a> to see the trade request.</p>
                    <b>Agrishare's Team</b>
                </div>`
    })
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Agrishare: Two-factor authentication code.",
        html: `<div>
                    <p>Your Agrishare OTP Code is: ${token}</p>
                    <p>Valid for 1 hour. NEVER share this code with others, including Agrishare staff.</p>
                    <b>Agrishare's Team</b>
                </div>`
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Agrishare: Reset your password",
        html: `<div>
                    <p>Click <a href="${resetLink}">here</a> to reset password.</p>
                    <p>Valid for 1 hour. NEVER share this code with others, including Agrishare staff.</p>
                    <b>Agrishare's Team</b>
                </div>`
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Agrishare: Confirm your email.",
        html: `<div>
                <p>Click <a href="${confirmLink}">here</a> to confirm email.</p>
                <p>Valid for 1 hour. NEVER share this code with others, including Agrishare staff.</p>
                <b>Agrishare's Team</b>
        </div>`
    })
}