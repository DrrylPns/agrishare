import React from 'react'
import aboutusBg from './_components/images/AboutUs.jpg'
import Image from 'next/image'
import Header from './_components/Header'
import MissionSvg from './_components/images/MissionImg.png'

function page() {
  return (
    <div>
      <Header/>
      <section className='relative h-[50vh] font-poppins'>
        <div className='relative flex flex-col justify-center items-center w-1/2 h-full mx-auto my-auto'>
          <h1 className='relative z-50 text-5xl text-center text-white font-bold tracking-tight'>About us</h1>
          <p className='relative z-50 text-white text-justify'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur delectus necessitatibus odit accusamus, qui distinctio architecto excepturi quae molestiae rerum eum, omnis saepe explicabo, ex tenetur libero eos. Totam, laudantium.</p>
        </div>
        <div className='absolute top-0 z-10 w-full h-[50vh] bg-transparent-whitist'>
        </div>
        <div className='absolute top-0 z-0 w-full  mx-auto '>
          <Image 
            src={aboutusBg}
            alt='Header Image'
            className='max-h-[50vh] min-h-fit z-0'
          />
        </div>
      </section>

      <section className='font-poppins flex justify-center items-center gap-10 px-20 text-white font-semibold bg-black h-dvh w-full'>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl font-poppins'>MISSION</h1>
          <p className='mt-5 text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex rem exercitationem sunt ratione velit veritatis ad architecto. Vero soluta reiciendis eligendi odio mollitia nemo vel possimus, maxime, assumenda molestiae fugiat.</p>
        </div>
        <div className='hidden md:block'>
          <Image 
            src={MissionSvg} 
            alt='Mission image'
            className='w-1/2'
          />
        </div>
      </section>

      <section className='font-poppins flex justify-center items-center gap-10 px-20 w-full h-dvh'>
        <div className=''></div>
        <div className=''></div>
      </section>
      <section>

      </section>
      <section>

      </section>
      <section>

      </section>
      <section>

      </section>
 
    </div>
  )
}

export default page