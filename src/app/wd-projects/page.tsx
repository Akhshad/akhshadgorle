"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "../components/ui/wobble-card";
import Link from 'next/link';
import Footer from "../components/Footer";

function page() {
    return (
<>
<section className="tms">
        <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        Temperature Management System
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Temperature Management System
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
              Temperature Monitoring System (TMS) is a user-friendly web app 
              displaying real-time temperature data in a simple card format
               for effective environment or process management.
              </p>
            </div>
            <Image
              src="/TMS-1.png"
              width={600}
              height={600}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px]">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Tools and Platform used:
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Angular : For Front-End Development
            NodeJS : For Back-End Development.
            MySQL : For Database Management. <br />
            AWS : For project Deployment.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              A temperature monitoring system tracks temperature changes in different settings like industries, healthcare, agriculture, and weather.
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              Highlight the significance of accurate temperature measurements for safety, process control, and data analysis.
              </p>
            </div>
            <Image
              src="/TMS-3.png"
              width={700}
              height={700}
              alt="linear demo image"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
</section>

        <div className="mt-20 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

<section id="wifi-config" >
        <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative  bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        Wi-fi Config Portal
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-green-800 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Wifi Config Portal
              </h2>
              <p className="mt-4 text-left  text-base/6 text-neutral-200">
              The WiFi-Config Portal simplifies configuring WiFi settings 
              for IoT devices through a user-friendly web interface, offering 
              network scanning, secure authentication, and easy configuration management.
              </p>
            </div>
            <Image
              src="/wc-2.png"
              width={600}
              height={600}
              alt="linear demo image"
              className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-yellow-600">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Tools and Platform used:
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Angular : For Front-End Development <br />
            MQTT Broker: For sending Message Request
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] bg-red-600">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              A WiFi configuration portal facilitates the setup and management of WiFi connections for devices in various environments, including homes, businesses, and industrial settings.
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">            
A             WiFi configuration portal facilitates the setup and management of WiFi connections for devices in various environments.
              </p>
            </div>
            <Image
              src="/wc-1.png"
              width={700}
              height={700}
              alt="linear demo image"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
</section>
<Footer />
</>
    );
}

export default page