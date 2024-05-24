"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../components/ui/lamp";
import { PinContainer } from "../components/ui/3d-pin";
import Link from "next/link";
import Footer from "../components/Footer";

function wd() {
  return (
    <>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="mt-15 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl"
        >
          Web Development
        </motion.h1>
      </LampContainer>

      <div>
        <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
          Projects
        </h3>
      </div>

      <div className="flex gap-10 flex-col lg:flex-row">
        <div className="h-[40rem] w-full flex items-center justify-center ">
          <PinContainer title="Temperature Management System" href="/wd-projects">
            <Link href="/wd-projects">
              <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[25rem]">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  Temperature Management System
                </h3>
                <div className="text-base !m-0 !p-0 font-light">
                  <span className="text-slate-500">
                    Temperature Monitoring System (TMS) is a user-friendly web app displaying real-time temperature data in a simple card format for effective environment or process management.
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-green-500 via-teal-500 to-blue-500" />
              </div>
            </Link>
          </PinContainer>
        </div>

        <div className="h-[40rem] w-full flex items-center justify-center ">
          <PinContainer title="Wifi Config Portal">
            <Link href="/wd-projects">
              <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[25rem]">
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                  Wifi Config Portal
                </h3>
                <div className="text-base !m-0 !p-0 font-light">
                  <span className="text-slate-500">
                    The WiFi-Config Portal simplifies configuring WiFi settings for IoT devices through a user-friendly web interface, offering network scanning, secure authentication, and easy configuration management.
                  </span>
                </div>
                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
              </div>
            </Link>
          </PinContainer>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default wd;
