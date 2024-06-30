import React from 'react';
import Swiper2 from "../components/ui/swiper2";

const Page = () => {
  return (
    <>
    <div className='mt-40'>
      <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
        Just in Case
      </h3>
      
    </div>
    <div class="max-w-5xl mx-auto bg-black text-gray-200 rounded-lg mt-10 p-4 lg:p-8">
   <Swiper2 />
    <h2 class="text-2xl mt-5 font-bold border-b border-gray-700 pb-2 mb-4">ABOUT THIS PROJECT</h2>
    <p class="mb-4 text-justify">
    The Just In Case (JIC) project is an innovative and stylish initiative aimed 
    at redefining the phone accessory market. Our goal is to provide a modern and
     personalized shopping experience where customers can explore a wide range of 
     customized phone covers. With a focus on unique designs, high-quality materials,
      and exceptional customer service, Just In Case aims to become a leader in the phone
       accessory industry.
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
            Redesigned the logo
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
