import React from 'react'
import aboutusBg from './_components/images/AboutUs.jpg'
import Image from 'next/image'
import Header from './_components/Header'
import MissionSvg from '@/app/(landing-page)/_components/images/MissionImg.png'
import VisionImage from './_components/images/Vision.png'
import LeafIcon from './_components/images/LeafIcon.png'
import HeadsetIcon from './_components/images/Headseticon.png'
import StarIcon from './_components/images/Staricon.png'
import Heart from './_components/images/Heart.png'
import { FaCheck } from 'react-icons/fa'
import { BsArrowRight, BsEnvelope, BsTelephone } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import Footer from './_components/Footer'
import { ContactUsForm } from '@/components/contact-us-form'


function page() {
  return (
    <div className='transition-all duration-1000 ease-in-out'>
      <Header />
      <section className='relative py-40 md:py-40 h-dvh font-poppins' id='aboutus'>
        <div className='relative my-auto px-10 md:px-40'>
          <h1 className='relative z-20 text-4xl md:text-7xl mb-10 text-center text-white font-bold tracking-wider'>About us</h1>
          <p className='relative z-20 text-white text-sm md:text-2xl text-center'>In August 2021, the Quezon City University - Center for Urban Agriculture and Innovation (QCU-CUAI) was established through the Board Resolution No. 14, s. 2021 with the aim of promoting urban agriculture as a measure to alleviate poverty, address stability of food supply, foster social integration among communities, and protect the environment through eco-friendly methods and other alternative and innovative gardening methods.</p>
        </div>
        <div className='absolute top-0 z-10 w-full h-dvh bg-white/20'>
        </div>
        <div className='absolute top-0 z-0 w-full mx-auto '>
          <Image
            src={aboutusBg}
            alt='Header Image'
            className='h-dvh z-0'
          />
        </div>
      </section>

      <section className='font-poppins flex justify-center items-center gap-10 px-20 text-white font-semibold bg-black h-dvh w-full'>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl mb-10 font-poppins'>MISSION</h1>
          <p className='mt-5 text-justify text-xl'>To lead in the production of innovative farming technologies, hosting of urban farming projects, and development of relevant research and community extension programs.</p>
        </div>
        <div className='hidden w-2/3 lg:flex justify-center items-center'>
          <Image
            src={MissionSvg}
            alt='Mission image'
            className='w-2/3 object-cover h-1/2'
          />
        </div>
      </section>

      <section className='font-poppins flex justify-center items-center gap-10 px-20 w-full h-dvh my-5'>
        <div className='hidden lg:flex justify-center items-center'>
          <Image
            src={VisionImage}
            alt='Vission image'
            className='w-[75%]'
          />
        </div>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl font-poppins uppercase text-center'>VISION</h1>
          <p className='mt-5 text-justify text-muted-foreground'>To be an internationally-recognized center in urban agriculture development, research, community engagement, and capability building toward achieving a livable and green Quezon City.</p>
          <div className='grid md:grid-cols-2 gap-5 mt-10 grid-cols-1'>
            <div className='flex items-center w-full gap-3'>
              <Image
                src={LeafIcon}
                alt='Leaf icon'
                className='md:h-10 md:w-10'
              />
              <div>
                <h1 className='font-medium md:text-sm lg:text-lg'>100% Organic food</h1>
                <h3 className='text text-muted-foreground md:text-sm lg:text-lg'>100% healthy & fresh food.</h3>
              </div>
            </div>
            <div className='flex items-center w-full gap-3'>
              <Image
                src={HeadsetIcon}
                alt='Headset icon'
                className='md:h-10 md:w-10'
              />
              <div>
                <h1 className='font-medium md:text-sm lg:text-lg'>Agritizens Feedback</h1>
                <h3 className='text text-muted-foreground md:text-sm lg:text-lg'>Our happy farmer</h3>
              </div>

            </div>
            <div className='flex items-center w-full gap-3'>
              <Image
                src={StarIcon}
                alt='Star icon'
                className='md:h-10 md:w-10'
              />
              <div>
                <h1 className='font-medium md:text-sm lg:text-lg'>Great Support 24/7</h1>
                <h3 className='text text-muted-foreground md:text-sm lg:text-lg'>Instant access to Contact</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-black font-poppins text-white flex justify-center items-center gap-10 px-20 md:px-40 w-full h-dvh'>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl font-poppins uppercase'>How it works?</h1>
          <p className='mt-5 text-justify'>Welcome to Agrishare!, Our platform allows you to trade with other users and donate to urban farmer while earning points that can be redeemed for goods and equipment.</p>
          <div className='mt-5'>
            <div className='flex gap-3 mt-3'>
              <span className='text-[#2C742F]'><FaCheck /></span>
              <h3>Trading</h3>
            </div>
            <div className='flex gap-3 mt-3'>
              <span className='text-[#2C742F]'><FaCheck /></span>
              <h3>Donation</h3>
            </div>
            <div className='flex gap-3 mt-3'>
              <span className='text-[#2C742F]'><FaCheck /></span>
              <h3>Points</h3>
            </div>
          </div>
          <Button variant={"default"} className='relative mt-5 z-20 rounded-2xl px-5 text-[0.7rem]'>Start Now!<span className='ml-2 text-lg'><BsArrowRight /></span></Button>
        </div>
        <div className='hidden lg:flex justify-center items-center'>
          <Image
            src={Heart}
            alt='Mission image'
            className='w w-2/3 h-full'
          />
        </div>
      </section>
      <section id='contactus' className='bg-white font-poppins text-white flex justify-center items-center px-5 md:px-40 py-44 w-full min-h-dvh h-dvh'>
        <ContactUsForm />
      </section>
      <Footer />

    </div>
  )
}

export default page