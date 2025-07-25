'use client'
import Image from 'next/image';
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "../components/ui/layout-grid";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button"
import { RetroGrid } from "../components/ui/retro-grid"

const ios = () => {
  return (
    <div>
    <div className="relative grid grid-cols-1 mt-20 justify-center px-4 md:px-8 lg:px-10">
    <Image
      src="/images/Hero.svg"
      width={1000}
      height={500}
      alt="Hero Image"
      className="rounded-lg object-contain w-full h-auto"
    />
  </div>  
  <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
    <Image
    src="/images/Colors.svg"
    alt="Colors"
    width={1000}
    height={500}
    className="rounded-lg object-contain w-full h-auto"
    />
    <Image
    src="/images/Typeface.svg"
    alt="Typeface"
    width={1000}
    height={500}
    className="rounded-lg object-contain w-full h-auto"
    />
    <Image
    src="/images/Design Systems.svg"
    alt="Design-Systems"
    width={1000}
    height={500}
    className="rounded-lg object-contain w-full h-auto"
    />
    
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">    
      If you think this is all I’ve got…<br/>
      lol, bless your optimism.
      </span>
      <div className='mt-10 items-center'>
      <a href="https://www.behance.net/gallery/222034761/Woofys-IOS-UI-Journey-Making-Pet-Care-a-Breeze" target="_blank" rel="noopener noreferrer">
      <InteractiveHoverButton>Witness the Madness</InteractiveHoverButton>
    </a>
    </div>
      <RetroGrid />
    </div>
    </div>
  );
};

export default ios;

const SkeletonOne = () => {
    return (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Typeface
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Woofy’s logo uses the <span className='font-bold text-[#1DB954] '>Gulf Display</span> typeface, known for its bold curves and modern appeal. 
        Its dynamic and friendly style perfectly embodies the brand’s playful yet professional identity.
        </p>
      </div>
    );
  };
   
const SkeletonTwo = () => {
    return (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
        Bold & Unforgettable
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
         Inspired by the strong and <span className="font-bold text-[#FE6438]">loyal Doberman</span>, Woofy’s logo combines sharp angles 
         and bold geometry to create a playful yet powerful mark—just like the spirited pets it represents.
        </p>
      </div>
    );
  };
const SkeletonThree = () => {
    return (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
        Woofy’s at Your Fingertips
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Your go-to Pet Care companion, now just a tap away! Easily book <span className='font-bold text-[#7541EE]'>Grooming,</span>&nbsp;
         <span className='font-bold text-[#FE6438]'>Boarding,</span> & <span className='font-bold text-[#1DB954]'>Agility Training</span> Services while staying connected with a community of 
        pet lovers—all within the Woofy’s app.
        </p>
      </div>
    );
  };
const SkeletonFour = () => {
    return (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
        About Woofy’s
        </p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        From expert care to trusted pet insights—everything in one place!
        <br/>
        Easily book Grooming, Boarding, Walking, and Agility Training, stay updated with
         our pet care blogs, and connect with a community of pet lovers—all in one seamless app.
        </p>
      </div>
    );
  };
   
const cards = [
    {
      id: 1,
      content: <SkeletonOne />,
      className: "md:col-span-2",
      thumbnail:
        "/images/Woofy_Yellow.png",
    },
    {
      id: 2,
      content: <SkeletonTwo />,
      className: "col-span-1",
      thumbnail:
        "/images/W_logo.png",
    },
    {
      id: 3,
      content: <SkeletonThree />,
      className: "col-span-1",
      thumbnail:
        "/images/app_icon.png",
    },
    {
      id: 4,
      content: <SkeletonFour />,
      className: "md:col-span-2",
      thumbnail:
        "/images/G-Van.png",
    },
  ];