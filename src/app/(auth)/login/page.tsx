import { LoginForm } from '@/components/login-form'
import React, { Suspense } from 'react'

const LoginPage = () => {
    return (
        <Suspense fallback={<>Loading...</>}>
            <LoginForm />
        </Suspense>
    )
}

export default LoginPage