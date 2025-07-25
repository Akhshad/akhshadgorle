"use client";
import React from "react";
import Image from "next/image"; // Importing Image from next/image
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";


const content = [
  {
    title: "UI/UX Utopia",
    description:
      "Immerse yourself in a sea of interactive, mesmerizing, and spectacular app interfaces.",
    content: (
      <Image
      src="/1.jpg"
      width={300}
      height={300}
      className="h-full w-full object-cover"
      alt="linear board demo"
    />
    ),
  },
  {
    title: "Graphics Galore",
    description:
      "Witness an array of awe-inspiring graphics that’ll leave you breathless.",
    content: (
      <div className="h-full w-full  flex items-center justify-center">
        <Image
          src="/Frame.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Front-end Marvel",
    description:
      "Unravel stunning, jaw dropping web design that re-define the meaning of modernity and excellence.",
    content: (
      <Image
      src="/2.jpg"
      width={300}
      height={300}
      className="h-full w-full object-cover"
      alt="linear board demo"
    />
    ),
  },
  {
    title: "",
    description:
      "",
    content: (
      <Image
      src="/placeholder.jpg" // Updated to a placeholder image
      width={300}
      height={300}
      className="h-full w-full object-cover"
      alt="linear board demo"
    />
    ),
  },
];

const Services = () => {
  return (
  <div>
    <StickyScroll content={content} />
  </div>
  );
};

export default Services
