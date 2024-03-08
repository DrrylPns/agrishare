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
import newsArray,{NewsItem} from './_components/dummyData/newsData'
import NewsCard from './_components/newsCard'
import { CiLocationOn } from 'react-icons/ci'
import ContactForm from './_components/ContactForm'
import Footer from './_components/Footer'


function page() {
  return (
    <div className='transition-all duration-1000 ease-in-out'>
      <Header/>
      <section className='relative h-dvh font-poppins'>
        <div className='relative flex flex-col justify-center items-center w-1/2 h-full mx-auto my-auto'>
          <h1 className='relative z-50 text-5xl text-center text-white font-bold tracking-tight'>About us</h1>
          <p className='relative z-50 text-white text-justify'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur delectus necessitatibus odit accusamus, qui distinctio architecto excepturi quae molestiae rerum eum, omnis saepe explicabo, ex tenetur libero eos. Totam, laudantium.</p>
        </div>
        <div className='absolute top-0 z-10 w-full h-dvh bg-transparent-whitist'>
        </div>
        <div className='absolute top-0 z-0 w-full  mx-auto '>
          <Image 
            src={aboutusBg}
            alt='Header Image'
            className='max-h-dvh min-h-fit z-0'
          />
        </div>
      </section>

      <section className='font-poppins flex justify-center items-center gap-10 px-20 text-white font-semibold bg-black h-dvh w-full'>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl font-poppins'>MISSION</h1>
          <p className='mt-5 text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex rem exercitationem sunt ratione velit veritatis ad architecto. Vero soluta reiciendis eligendi odio mollitia nemo vel possimus, maxime, assumenda molestiae fugiat.</p>
        </div>
        <div className='hidden lg:flex justify-center items-center'>
          <Image 
            src={MissionSvg} 
            alt='Mission image'
            className='w-1/2'
          />
        </div>
      </section>

      <section className='font-poppins flex justify-center items-center gap-10 px-20 w-full h-dvh'>
        <div className='hidden lg:flex justify-center items-center'>
          <Image 
            src={VisionImage} 
            alt='Vission image'
            className='w-1/2'
          />
        </div>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl font-poppins uppercase'>VISION</h1>
          <p className='mt-5 text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex rem exercitationem sunt ratione velit veritatis ad architecto. Vero soluta reiciendis eligendi odio mollitia nemo vel possimus, maxime, assumenda molestiae fugiat.</p>
         <div className='grid grid-cols-2 gap-5 mt-10'>
          <div className='flex items-center w-full '>
            <Image 
              src={LeafIcon} 
              alt='Leaf icon'
              className='h-[2rem] w-[2rem] md:h-10 md:w-10'
            />
            <div>
              <h1 className='font-medium text-[0.6rem] md:text-sm lg:text-lg'>100% Organic food</h1>
              <h3 className='text text-gray-300 text-[0.6rem] md:text-sm lg:text-lg'>100% healthy & fresh food.</h3>
            </div>
          </div>
          <div className='flex items-center w-full '>
            <Image 
              src={HeadsetIcon} 
              alt='Headset icon'
              className='h-[2rem] w-[2rem] md:h-10 md:w-10'
            />
            <div>
              <h1 className='font-medium text-[0.6rem] md:text-sm lg:text-lg'>100% Organic food</h1>
              <h3 className='text text-gray-300 text-[0.6rem] md:text-sm lg:text-lg'>100% healthy & fresh food.</h3>
            </div>
          </div>
          <div className='flex items-center w-full '>
            <Image 
              src={StarIcon} 
              alt='Star icon'
              className='h-[2rem] w-[2rem] md:h-10 md:w-10'
            />
            <div>
              <h1 className='font-medium text-[0.6rem] md:text-sm lg:text-lg'>100% Organic food</h1>
              <h3 className='text text-gray-300 text-[0.6rem] md:text-sm lg:text-lg'>100% healthy & fresh food.</h3>
            </div>
          </div>
         </div>
        </div>
      </section>

      <section className='bg-black font-poppins text-white flex justify-center items-center gap-10 px-20 w-full h-dvh'>
        <div className='w-full md:w-1/2'>
          <h1 className='font-semibold text-4xl font-poppins uppercase'>How it works?</h1>
          <p className='mt-5 text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex rem exercitationem sunt ratione velit veritatis ad architecto. Vero soluta reiciendis eligendi odio mollitia nemo vel possimus, maxime, assumenda molestiae fugiat.</p>
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
          <Button variant={"default"} className='relative mt-5 z-50 rounded-2xl px-5 text-[0.7rem]'>Start Now!<span className='ml-2 text-lg'><BsArrowRight /></span></Button>
        </div>
        <div className='hidden lg:flex justify-center items-center'>
          <Image 
            src={Heart} 
            alt='Mission image'
            className='w-1/2'
          />
        </div>
      </section>

      <section className='font-poppins px-32 py-10 w-full min-h-dvh'>
        <h1 className='text-2xl font-semibold text-center'>Latest news</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-2 md:gap-5'>
          {newsArray.length > 0 && newsArray.map((news: NewsItem)=>(
            <div key={news.id}>
              <NewsCard 
                 category={news.category}
                 userRole={news.userRole}
                 description={news.description}
                 image={news.image}
                 date={news.createdAt}
                 comments={news.arrayOfComments}
              />
            </div>
          ))}
        </div>
      </section>

      <section className='bg-black font-poppins text-white flex flex-col md:flex-row justify-center items-center gap-10 p-10 md:p-32 w-full min-h-dvh h-dvh'>
        <div className='flex flex-col items-center justify-between px-5 py-5 rounded-lg bg-white text-black h-full w-full md:w-1/3'>
          <div className='text-lg flex flex-col items-center justify-center'>
            <span className='text-[2rem]'><CiLocationOn /></span>
            <h1>123 Lily St. Batasan Hills Q.C.</h1>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <span className='text-[2rem]'><BsEnvelope /></span>
            <h1>Proxy@gmail.com</h1>
            <h1>Help.proxy@gmail.com</h1>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <span className='text-[2rem]'><BsTelephone /></span>
            <h1>(219) 555-0114</h1>
            <h1>(164) 333-0487</h1>
          </div>
        </div>
        <div className='w-full mt-5 md:w-[70%] bg-white h-full'>
       
        </div>
      </section>
      <Footer/>
 
    </div>
  )
}

export default page