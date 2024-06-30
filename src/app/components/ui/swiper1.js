"use client";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './swiper.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Sliding = () => {
  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
       centeredSlides={true} 
    >
      <SwiperSlide className={style.swiperSlide}>
        <img
          src="images/fp.png" alt="one"
         
        />
      </SwiperSlide>

    </Swiper>
  );
};

export default Sliding;
