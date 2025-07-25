  "use client";
  import React from "react";
  import { motion } from "framer-motion";
  import { LampContainer } from "../components/ui/lamp";
  import Link from "next/link";
  import Image from "next/image";
  import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
  import Footer from "../components/Footer";



  function uiux() {
    return (
      <>
      <LampContainer className="">
    <motion.h1
    initial={{opacity: 0.5, y: 100}}
    whileInView={{ opacity: 1, y: 0}}
    transition={{
      delay: 0.3,
      duration: 0.8,
      ease: "easeOut",
    }}
    className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
      UI/UX Design
    </motion.h1>
  </LampContainer>


  <div>
    <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
      Projects
      </h3>
  </div>

  <div className="flex gap-10 align-center justify-center flex-col lg:flex-row">
  <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-purple-500/[0.8] bg-black border-white/[0.1] border-gray/[0.2] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 text-white"
          >
            FauxSwoosh
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2"
          >
            FauxSwoosh is a meticulously crafted replica of the Nike website.
          </CardItem>
          <CardItem translateZ="100" className="w-auto mt-4">
            <Image
              src="/N1.jpg"
              height="1920"
              width="1080"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            {/* <CardItem
              translateZ={20}
              as={Link}
              href="https://twitter.com/mannupaaji"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Try now →
            </CardItem> */}
            <CardItem
              translateZ={20}
              as={Link}
              href="https://www.figma.com/design/v5zfY7JTTvLLkMZdHU0V9v/Nike?node-id=0%3A1&t=1UpM3CLgi5IgmISe-1"
              className="px-4 py-2 rounded-xl bg-black bg-white text-black text-black text-xs font-bold"
            >
              View
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-green-500/[0.8] bg-black border-white/[0.2] border-gray/[0.3] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-white"
          >
          Smart Work Permit Dashboard
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 "
          >
            A Smart Work Permit is a digital system that streamlines the issuance and management of work permits, enhancing efficiency and compliance.
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src="/SWP-1.png"
              height="1920"
              width="1080"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            {/* <CardItem
              translateZ={20}
              as={Link}
              href="https://twitter.com/mannupaaji"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Try now →
            </CardItem> */}
            <CardItem
              translateZ={20}
              as={Link}
              href="https://www.figma.com/design/ndK01grPokubyjS9mvJtv8/Smart-Work-Permit?node-id=4%3A2&t=zc9x7PEkQEodFpWi-1"
              className="px-4 py-2 rounded-xl bg-white text-black  text-xs font-bold"
            >
              View
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>


      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card hover:shadow-2xl hover:shadow-yellow-500/[0.8] bg-black  border-gray/[0.3] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-white"
          >
            SUZDO 
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            A car washing brand.
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src="/SZ1.png"
              height="1920"
              width="1080"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            {/* <CardItem
              translateZ={20}
              as={Link}
              href="https://twitter.com/mannupaaji"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Try now →
            </CardItem> */}
            <CardItem
              translateZ={20}
              as={Link}
              href="https://www.figma.com/design/G72Qou8rNz4e7tN5QmW19b/Sudzo?node-id=0%3A1&t=57BRgG8LizKaF9r8-1"
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
    )
  }

  export default uiux