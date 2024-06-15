"use client";
import Image from "next/image";
import { Tabs } from "../../components/ui/tabs"; 

function KaloriePage() {
  const tabs = [
    {
      title: "1",
      value: "1",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <DummyContent />
        </div>
      ),
    },
    {
      title: "2",
      value: "2",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <DummyContent1 />
        </div>
      ),
    },
    {
      title: "3",
      value: "3",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <DummyContent2 />
        </div>
      ),
    },
    {
      title: "4",
      value: "4",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <DummyContent3 />
        </div>
      ),
    },
    {
      title: "5",
      value: "5",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <DummyContent4 />
        </div>
      ),
    },
  ];

  return (
    <>
      <h3 className="mt-20 text-4xl sm:text-4xl text-center font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        Kalorie Clinic
      </h3>
      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-10">
        <Tabs tabs={tabs} />
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-black text-gray-200 rounded-lg mt-[10rem]">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mb-4">About This Project</h2>
        <p className="mb-4 text-justify">
          The Kalorie Clinic project is an innovative initiative aimed at transforming diet and nutrition services.
          Our mission is to provide a welcoming environment where clients receive personalized meal plans and expert
          dietary advice. With a focus on health, innovation, and excellence, Kalorie Clinic is dedicated to guiding
          clients on their wellness journey. In this project, I designed the logo and created engaging Instagram visuals
          to enhance our brand identity and outreach.
        </p>
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Role in Project</h3>
        <ul className="list-none mb-4">
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            Logo Designer
          </li>
        </ul>
        <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">My Responsibilities</h3>
        <ul className="list-none">
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            To design the logo
          </li>
          <li className="pl-4 mb-2 relative before:content-['•'] before:absolute before:left-0 before:text-white before:font-bold">
            Make creatives for Instagram
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
};

const DummyContent = () => (
  <Image
    src="/images/k-1.png"
    alt="dummy image"
    width="1000"
    height="1000"
    className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
  />
);

const DummyContent1 = () => (
  <Image
    src="/images/k-2.png"
    alt="dummy image"
    width="1000"
    height="1000"
    className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
  />
);

const DummyContent2 = () => (
  <Image
    src="/images/k-3.png"
    alt="dummy image"
    width="1000"
    height="1000"
    className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
  />
);

const DummyContent3 = () => (
  <Image
    src="/images/k-4.png"
    alt="dummy image"
    width="1000"
    height="1000"
    className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
  />
);

const DummyContent4 = () => (
  <Image
    src="/images/k-5.png"
    alt="dummy image"
    width="1000"
    height="1000"
    className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
  />
);

export default KaloriePage;
