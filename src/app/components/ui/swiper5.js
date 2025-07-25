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
        <img src="images/RLT.png" alt="one" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/Logo_Mark.png" alt="two" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/Description.png" alt="three" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/Colors-rl.png" alt="four" />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img src="images/Typography.png" alt="five" />
      </SwiperSlide>
      
      <SwiperSlide className={style.swiperSlide}>
        <img src="images/Mockups.png" alt="six" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Sliding;