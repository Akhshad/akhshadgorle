"use client";
import Image from "next/image";
import { Tabs } from "../../components/ui/tabs";

export function xplore() {
  const tabs = [
    {
      title: "1",
      value: "1",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl  text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          {/* <p>Main</p> */}
          <DummyContent />
        </div>
      ),
    },
    {
      title: "2",
      value: "2",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          {/* <p>Logo</p> */}
          <DummyContent1 />
        </div>
      ),
    },
    {
      title: "3",
      value: "3",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          {/* <p>Scale</p> */}
          <DummyContent2 />
        </div>
      ),
    },
    {
      title: "4",
      value: "4",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          {/* <p>Colors</p> */}
          <DummyContent3 />
        </div>
      ),
    },
    {
      title: "5",
      value: "5",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          {/* <p>Branding</p> */}
          <DummyContent4 />
        </div>
      ),
    },
  ];

  return (
    <>
     <h3 className="mt-20 text-4xl sm:text-4xl text-center font-bold relative  bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        Xplore Saloon
    </h3>
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-10">
      <Tabs tabs={tabs} />
    </div>

    {/* <h3 className="mt-40 text-2xl sm:text-4xl text-center font-bold relative  bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        ABOUT THIS PROJECT
    </h3>
    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-10 h-[1px] w-full" /> */}

    <div className="max-w-4xl mx-auto p-6 bg-black text-gray-200 rounded-lg mt-[10rem] ">
      <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4">About This Project</h2>
      <p className="mb-4 text-justify">
       The Xplore Salon Franchise project is an innovative 
       and stylish initiative aimed at redefining the salon experience. 
       Our goal is to establish a modern and welcoming environment where 
       customers can explore a wide range of beauty and grooming services. 
       With a focus on cutting-edge techniques, premium products, and exceptional 
       customer service, Xplore Salon aims to become a leader in the beauty industry.
        Our brand embodies elegance, innovation, and professionalism, ensuring that every visit 
        is a unique and satisfying experience for our clients. Join us on this exciting journey
         as we revolutionize the way you explore beauty.
      </p>
      <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Role in Project</h3>
      <ul className="list-none mb-4">
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">Logo Designer</li>
      </ul>
      <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">My Responsibilities</h3>
      <ul className="list-none">
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
         To design the logo 
        </li>
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
         Branding
        </li>
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
          To design a Brochure
        </li>
      </ul>

      <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Tools Used</h3>
      <ul className="list-none">
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
         Adobe Illustrator
        </li>
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
        Adobe Photoshop
        </li>
        <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
          Figma
        </li>
      </ul>
    </div>

    </>
  );
}

const DummyContent = () => {
  return (
    <Image
      src="/images/xplore.png"
      alt="dummy image"
      width="1000"
      height="1000"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};

const DummyContent1 = () => {
    return (
      <Image
        src="/images/x1.png"
        alt="dummy image"
        width="1000"
        height="1000"
        className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
      />
    );
  };
const DummyContent2 = () => {
    return (
      <Image
        src="/images/x3.png"
        alt="dummy image"
        width="1000"
        height="1000"
        className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
      />
    );
  };
  const DummyContent3 = () => {
    return (
      <Image
        src="/images/x5.png"
        alt="dummy image"
        width="1000"
        height="1000"
        className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
      />
    );
  };
  const DummyContent4 = () => {
    return (
      <Image
        src="/images/x6.png"
        alt="dummy image"
        width="1000"
        height="1000"
        className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
      />
    );
  };

export default xplore;
