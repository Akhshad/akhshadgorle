import React from 'react'
import { EvervaultCard, Icon } from "../components/ui/evervault-card";

const Tools = () => {
  return (
      
    <>
<div className="h-[50rem] -mt-40 w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative  items-center justify-center">
      
      <div className="absolute pointer-events-none inset-0  items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="d text-4xl sm:text-7xl text-center font-bold relative  bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
        Tools
      </p>
  
    <div className="flex gap-10 flex-col lg:flex-row">
 
      <div className="border border-black/[0.2] dark:border-white/[0.2] mt-20 flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem] w-[40rem]">
              <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

              <EvervaultCard text="Design" />


             <div className="flex gap-2">  
             <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
                 Illustrator
            </p>
             <p className="text-sm border flex font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
               Photoshop
            </p>
             <p className="text-sm border flex font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
               Figma
            </p>
             <p className="text-sm border flex font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
               Premiere Pro
            </p>
             
              </div>
              <div className="flex gap-2">  
             <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
                 After Effects
            </p>
           
             
              </div>
      </div>
    
      <div className="border border-black/[0.2] dark:border-white/[0.2] mt-20 flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]">
              <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

              <EvervaultCard text="Development" />

             <div className="flex gap-2">  
             <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
                 HTML
            </p>
             <p className="text-sm border flex font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
               CSS
            </p>
             <p className="text-sm border flex font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
               SCSS
            </p>
             <p className="text-sm border flex font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
               React.js
            </p>
            <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
                 Next.js
            </p>
             
              </div>
              <div className="flex gap-2">  
             
             <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
                 Angular
            </p>
             <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5 hover:bg-gray-800">
                 GSAP
            </p>

              </div>
      
      </div>
      </div>

      </div>
    </>
  )
}

export default Tools