import React from 'react';
import Swiper5 from "../components/ui/swiper5";

const Page = () => {
  return (
    <>
    <div className='mt-40'>
      <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
        Right Ladder Technologies 
      </h3>
      
    </div>
    <div class="max-w-5xl mx-auto bg-black text-gray-200 rounded-lg mt-10 p-4 lg:p-8">
   <Swiper5 />
    <h2 class="text-2xl mt-5 font-bold border-b border-gray-700 pb-2 mb-4">ABOUT THIS PROJECT</h2>
    <p class="mb-4 text-justify">
   The Right Ladder project is a transformative initiative committed to redefining 
   career growth through skill-focused IT education and expert consulting. Our mission
    is to equip individuals and organizations with the technical expertise, real-world 
    exposure, and strategic guidance they need to thrive in today’s digital landscape. 
    With a foundation built on quality, integrity, and true upskilling, Right Ladder Technologies
     empowers learners to climb higher - one skill, one solution at a time.
    </p>
    <h3 class="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Role in Project</h3>
    <ul class="list-none mb-4">
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Graphic Designer</li>
    </ul>
    <h3 class="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">My Responsibilities</h3>
    <ul class="list-none mb-4">
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
        To design the logo 
        </li>
        <li class="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
        To design creatives for instagram stories & post
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
