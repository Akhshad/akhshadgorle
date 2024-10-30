"use client";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './swiper.module.css';
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
        <img
          src="images/srujan.png" alt="one"
         
        />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s2.png" alt="two"
          
        />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s3.png" alt="three"
         
        />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s4.png" alt="four"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s5.png" alt="five"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s6.png" alt="six"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s7.png" alt="seven"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/s8.png" alt="eight"
          
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default Sliding;
