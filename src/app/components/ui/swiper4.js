"use client";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './swiper.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

const Sliding = () => {
  const slides = [
    { src: "/images/srujan.png", alt: "one" },
    { src: "/images/s2.png", alt: "two" },
    { src: "/images/s3.png", alt: "three" },
    { src: "/images/s4.png", alt: "four" },
    { src: "/images/s5.png", alt: "five" },
    { src: "/images/s6.png", alt: "six" },
    { src: "/images/s7.png", alt: "seven" },
    { src: "/images/s8.png", alt: "eight" },
  ];

  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      className="mySwiper"
      centeredSlides={true}
    >
      {slides.map((slide, index) => (
        <SwiperSlide className={style.swiperSlide} key={index}>
          <Image
            src={slide.src}
            alt={slide.alt}
            width={1200}
            height={700}
            className="w-full h-auto"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Sliding;
