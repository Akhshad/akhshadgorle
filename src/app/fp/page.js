import React from 'react';
import Swiper1 from "../components/ui/swiper1";

const Page = () => {
  return (
    <>
    <div className='mt-40'>
      <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
        Female Planet
      </h3>
      
    </div>
    <div class="max-w-5xl mx-auto bg-black text-gray-200 rounded-lg mt-10 p-4 lg:p-8">
   <Swiper1 />
    <h2 class="text-2xl mt-5 font-bold border-b border-gray-700 pb-2 mb-4">ABOUT THIS PROJECT</h2>
    <p class="mb-4 text-justify">
    The Female Planet project is a dynamic and empowering initiative designed 
    to celebrate and support women from all walks of life. Our mission is to
     create a vibrant and inclusive platform where women can connect, inspire,
      and thrive. With a focus on engaging content, impactful visuals, and a 
      strong community spirit, Female Planet aims to become a leading voice in
       the empowerment of women.
    </p>
    <h3 class="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Role in Project</h3>
    <ul class="list-none mb-4">
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Graphic Designer</li>
    </ul>
    <h3 class="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">My Responsibilities</h3>
    <ul class="list-none mb-4">
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            To design creatives for instagram post
        </li>
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
        To design creatives for instagram stories
        </li>
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            To design a banner for youtube 
        </li>
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            To design a thumbnails for youtube 
        </li>
    </ul>
    <h3 class="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Tools Used</h3>
    <ul class="list-none">
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            Adobe Illustrator
        </li>
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            Adobe Photoshop
        </li>
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            Figma
        </li>
    </ul>
</div>

      
      </>
    

  );
};

export default Page;
