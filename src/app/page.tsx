'use client'
import Footer from "./components/Footer";
import Herosection from "./components/Herosection";
import Tools from "./components/Tools";
import Welcome from "./components/Welcome";
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import Preloader from '../app/components/Preloader';
import Landing from '../app/components/Landing';
import Description from '../app/components/Description';
import Bento from "./components/bento-grid-demo-3";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect( () => {
    (
      async () => {
          const LocomotiveScroll = (await import('locomotive-scroll')).default
          const locomotiveScroll = new LocomotiveScroll();

          setTimeout( () => {
            setIsLoading(false);
            document.body.style.cursor = 'default'
            window.scrollTo(0,0);
          }, 2000)
      }
    )()
  }, [])

  return (
    <main className="">
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Landing/>
      <Description/>
      <Welcome/>
      <Bento /> 
      <Tools />
      <Footer />
    </main>
 
  );
}
