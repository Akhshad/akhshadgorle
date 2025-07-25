"use client";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './swiper.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

const Sliding = () => {
  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      className="mySwiper"
      centeredSlides={true}
    >
      {[
        { src: "/images/k1.png", alt: "one" },
        { src: "/images/k2.png", alt: "two" },
        { src: "/images/k3.png", alt: "three" },
        { src: "/images/k4.png", alt: "four" },
        { src: "/images/k5.png", alt: "five" },
        { src: "/images/k6.png", alt: "six" },
        { src: "/images/k7.png", alt: "seven" },
        { src: "/images/k8.png", alt: "eight" },
      ].map((item, index) => (
        <SwiperSlide className={style.swiperSlide} key={index}>
          <Image
            src={item.src}
            alt={item.alt}
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
