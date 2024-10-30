import React from 'react';
import Swiper from "../components/ui/swiper"; // Adjust the import path if necessary

const Page = () => {
  return (
    <>
    
      <div className='mt-40'>
        <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
          Xplore Saloon
        </h3>
      </div>
      <div className="max-w-5xl mx-auto bg-black text-gray-200 rounded-lg mt-10 p-4 lg:p-8">
        <Swiper />
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4">ABOUT THIS PROJECT</h2>
        <p className="mb-4 text-justify">
          The Xplore Salon Franchise project is an innovative and stylish initiative aimed at redefining the salon experience.
          Our goal is to establish a modern and welcoming environment where customers can explore a wide range of beauty and grooming services.
          With a focus on cutting-edge techniques, premium products, and exceptional customer service, Xplore Salon aims to become a leader in the beauty industry.
          Our brand embodies elegance, innovation, and professionalism, ensuring that every visit is a unique and satisfying experience for our clients. Join us on this exciting journey as we revolutionize the way you explore beauty.
        </p>
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Role in Project</h3>
        <ul className="list-none mb-4">
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Logo Designer</li>
        </ul>
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">My Responsibilities</h3>
        <ul className="list-none mb-4">
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">To design the logo</li>
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Branding</li>
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">To design a Brochure</li>
        </ul>
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Tools Used</h3>
        <ul className="list-none">
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Adobe Illustrator</li>
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Adobe Photoshop</li>
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Figma</li>
        </ul>
      </div>
    </>
  );
};

export default Page;
