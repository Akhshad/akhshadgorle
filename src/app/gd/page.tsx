"use client";
import React, { useState } from "react"; // Import useState here
import { LampContainer } from "../components/ui/lamp";
import Footer from "../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DirectionAwareHover } from "../components/ui/direction-aware-hover";
import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card";

function Gd() {
 
  return (
    <>
      <LampContainer className="">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="mt-15 bg-gradient-to-br from-slate-300 to slate-500 
          bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl"
        >
          Graphic Design
        </motion.h1>
      </LampContainer>

      <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        Projects
      </h3>

      <div className="flex gap-5 align-center justify-center flex-col lg:flex-row w-auto">
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-white/[0.4] bg-black  border-white/[0.3] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold  text-white"
        >
          Xplore Saloon
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-500"
        >
         Logo Design
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/images/xplore.png"
            height="1920"
            width="1080"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/xp"
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            View
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>

    <CardContainer className="inter-var"> 
      <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-pink-700  bg-black border-white/[0.2]  w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold  text-white"
        >
         Female Planet
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-500"
        >
          Creatives
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/images/FP.png"
            height="1920"
            width="1080"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/fp"
            className="px-4 py-2 rounded-xl bg-black bg-white text-black  text-xs font-bold"
          >
            View
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>

    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-green-300 bg-black border-white/[0.2]  w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-white"
        >
         Just in Case
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-500"
        >
           Logo Design & Creatives
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/images/JIC.png"
            height="1920"
            width="1080"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/jic"
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            View
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
    </div>

    <div className="flex gap-5 align-center justify-center flex-col lg:flex-row">
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card shadow-2xl hover:shadow-pink-700 bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-white"
        >
          Kalorie Clinic
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-500"
        >
         Logo Design & Creatives
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/images/k1.png"
            height="1920"
            width="1080"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/kalorie"
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            View
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>

    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card hover:shadow-2xl hover:shadow-white/[0.5] bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-white"
        >
          Srujan Counselling
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-500"
        >
         Logo Design & Creatives
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/images/srujan.png"
            height="1920"
            width="1080"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/srujan"
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            View
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card hover:shadow-2xl hover:shadow-[#7AFB03] bg-black border-white/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-white"
        >
          The Right Ladder Technologies
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-500"
        >
         Logo Design & Creatives
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/images/RL.png"
            height="1920"
            width="1080"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/rightladder"
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            View
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
    </div>

      <Footer />
    </>
  );
}

export default Gd;
