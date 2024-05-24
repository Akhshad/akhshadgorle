import Link from "next/link"
import { Spotlight } from "./ui/Spolight"
import { SparklesCore } from "./ui/sparkles"
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

const words = `I'm a versatile creator wearing multiple hats—bridging the realms of
graphic design, frontend development, and UI/UX design to craft
immersive digital experiences that captivate and inspire.
`;

const Herosection = () => {
  return (
    <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
      <div className="p-4 relative z-10 w-full text-center">
      <Spotlight
        className="-top-[2rem] lg:left-[35rem] xl:left-[45rem] left-[5rem] md:-left-[50rem]"
        fill="white"
      />

     <h1 className="mt-20 md:text-7xl text-3xl lg:text-7xl font-bold text-center text-white relative z-20">
         Hello, <br /> My Name is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 animate-text-gradient">Akhshad!</span>
     </h1>
        <div className="w-[40rem] h-20 flex items-center justify-center relative lg:left-[30rem] xl:left-[40rem] -left-10">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore 
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full "
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black  [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
     
      <TextGenerateEffect className="font-light -mt-10  text-center  text-neutral-300 max-w-lg mx-auto " words={words} />

      <div className="mt-8 justify-center text-center">
        <Link href={"/portfolio"}>
          <HoverBorderGradient  containerClassName="rounded-full"
            as="button"
           className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2">
        View Portfolio
          </HoverBorderGradient>
        
          </Link>
      </div>
    </div>
  );
};


export default Herosection