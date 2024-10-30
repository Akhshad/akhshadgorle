"use client";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './swiper.module.css'; // Ensure this file exists for styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const Sliding = () => {
  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination, Autoplay]} // Include Autoplay module
      autoplay={{
        delay: 2000, // Delay between slides in milliseconds
        disableOnInteraction: false, // Autoplay continues after user interaction
      }}
      className="mySwiper"
      centeredSlides={true}
    >
      <SwiperSlide className={style.swiperSlide}>
        <img src="images/xplore.png" alt="one" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/x3.png" alt="two" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/x5.png" alt="three" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/x6.png" alt="four" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Sliding;
