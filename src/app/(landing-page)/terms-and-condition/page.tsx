import React from 'react'

const page = () => {
    return (
        <div className="flex flex-col h-screen">
            <main className="flex-1 overflow-y-auto py-6 md:py-12 lg:py-24 xl:py-32">
                <div className="container flex flex-col min-h-full space-y-4 px-4 md:space-y-6 md:px-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Terms and Conditions</h1>
                    </div>

                    <div>
                        <p className='font-bold'>Effective Date: November 26, 2023</p>
                        <h1 className='text-2xl font-bold'>Welcome to Agrishare</h1>
                        <p className='text-neutral-500'>
                            Please read these terms and conditions carefully before using our application.
                            By accessing or using AGRIShare, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our application.
                        </p>
                    </div>


                    <div className="prose max-w-none space-y-3">

                        {/* 1. */}
                        <h2 className='text-3xl font-bold'>1.Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Agrishare donating, you agree to these terms and conditions. If you do not agree to all the terms and conditions, then you may not access the service.
                        </p>

                        {/* 2. */}
                        <h2 className='text-3xl font-bold'>2.Description of Services</h2>
                        <p>
                            Our platform facilitates the donation of agricultural products. Users can list products, connect with potential donors, and coordinate the donation process.
                        </p>

                        {/* 3. */}
                        <h2 className='text-3xl font-bold'>3. User Responsibilities</h2>
                        <div className='flex flex-col space-y-3'>
                            <p>
                                a. <span className='font-bold'>Accurate Information:</span> Users are responsible for providing accurate and up-to-date information when using the platform.
                            </p>

                            <p>
                                b. <span className='font-bold'>Legal Compliance:</span> Users must comply with all applicable laws and regulations related to agricultural product donation.
                            </p>

                            <p>
                                c. <span className='font-bold'>Account Security:</span> Users are responsible for maintaining the security of their accounts and passwords.
                            </p>
                        </div>

                        {/* 4. */}
                        <h2 className='text-3xl font-bold'>4. Donations</h2>
                        <div className='flex flex-col space-y-3'>
                            <p>
                                a. <span className='font-bold'>Listing Products:</span> Users can list agricultural products they wish to donate, providing details such as product type, quantity, and condition.
                            </p>

                            <p>
                                b. <span className='font-bold'>Communication:</span> Users can communicate with potential donors through the platform to facilitate the donation process.
                            </p>
                        </div>

                        {/* 5. */}
                        <h2 className='text-3xl font-bold'>5. Prohibited Activities</h2>
                        <div className='flex flex-col space-y-3'>
                            <p>
                                a. <span className='font-bold'>Illegal Content:</span> Users are prohibited from uploading or sharing illegal or inappropriate content.
                            </p>

                            <p>
                                b. <span className='font-bold'>Fraudulent Activities:</span> Users must not engage in fraudulent activities, including misrepresentation of products or intentions.
                            </p>
                        </div>

                        {/* 6. */}
                        <h2 className='text-3xl font-bold'>6. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend user accounts for violations of these terms or for any other reason at our discretion.
                        </p>


                        {/* 7. */}
                        <h2 className='text-3xl font-bold'>7. Changes to Terms and Conditions</h2>
                        <p>
                            We reserve the right to modify these terms and conditions at any time. Users will be notified of significant changes.
                        </p>

                        {/* 8. */}
                        <h2 className='text-3xl font-bold'>8. Privacy Policy</h2>
                        <p>
                            Please refer to our Privacy Policy for information on how we collect, use, and disclose your personal information
                        </p>
                        <h2 className='text-3xl font-bold'>9. Contact Information</h2>
                        <p className=''>
                            For questions or concerns regarding these terms and conditions, please contact us at emailnyolagaynyo@gmail.com
By using the Agrishare donating, you agree to these terms and conditions. Thank you for being a part of our community.
                                                    </p>
                    </div>
                </div>
            </main>
            <footer className="flex items-center justify-center w-full h-12 px-4 border-t md:h-16">
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                    AGRISHARE © 2023. All Rights Reserved
                </div>
            </footer>
        </div>
    )
}

export default page