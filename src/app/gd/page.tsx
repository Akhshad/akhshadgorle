"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../components/ui/lamp";
import Footer from "../components/Footer";
import styles from './page.module.css'
import { useState } from 'react';
import Project from '../components/ui/project';
import Modal from '../components/ui/modal';

const projects = [

    { 
      title: "XPLORE Saloon",  
      src: "xplore.png", 
      color: "#000000" ,
      description: "Logo Design",
      view: ""
    },
  
    { 
      title: "Just in Case", 
      src: "JIC.png",  
      color: "#A1B8BA",
      description: "Logo Design & Creatives",
      view: "https://www.instagram.com/just_in_case.jic?igsh=N2hld3JoMzQ4cXpr"
    },
  
    {
      title: "Female Planet", 
      src: "FP.png",  
      color: "#E1237D",
      description: "Creatives",
      view: "https://www.instagram.com/femaleplanet.in?igsh=YmRqa3JubGtkdjA2"
    },

    {
      title: "Billboards", 
      src: "M.png",  
      color: "#D9481B",
      description: "Creatives",
    },
  
  
  
  ]

function gd() {
    const [modal, setModal] = useState({active: false, index: 0})
  return (
  <>
<LampContainer className="">
  <motion.h1
  initial={{opacity: 0.5, y: 100}}
  whileInView={{ opacity: 1, y: 0}}
  transition={{
    delay: 0.3,
    duration: 0.8,
    ease: "easeOut",
  }}
  className="mt-15 bg-gradient-to-br from-slate-300 to slate-500 
  bg-clip-text text-center text-4xl font-bold text-trasparent md:text-7xl 
  ">
   Graphic Design
  </motion.h1>
</LampContainer>

<h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
    Projects
</h3>

<div className="mt-10 ">
<main className={styles.main}>

<div className={styles.body}>
  {
    projects.map( (project, index) => {
      return <Project index={index} title={project.title} description={project.description} setModal={setModal} key={index}/>
    })
  }
</div>
<Modal modal={modal} projects={projects}/>
</main>
</div>

<Footer />
</>
  )
}

export default gd
