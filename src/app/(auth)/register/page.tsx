import { RegisterForm } from '@/components/register-form'
import React, { Suspense } from 'react'

const RegisterPage = () => {
    return (
        <Suspense fallback={<>Loading...</>}>
            <RegisterForm />
        </Suspense>
    )
}

export default RegisterPage