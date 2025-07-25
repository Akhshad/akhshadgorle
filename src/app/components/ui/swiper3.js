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
          src="images/k1.png" alt="one"
         
        />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k2.png" alt="two"
          
        />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k3.png" alt="three"
         
        />
      </SwiperSlide>

      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k4.png" alt="four"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k5.png" alt="five"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k6.png" alt="six"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k7.png" alt="seven"
          
        />
      </SwiperSlide>
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/k8.png" alt="eight"
          
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default Sliding;