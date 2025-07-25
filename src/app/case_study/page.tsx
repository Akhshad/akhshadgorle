import React from "react";
import { Cover } from "../components/ui/cover";
import { TimelineDemo } from "../components/uxtimeline";

export function CoverDemo() {
  return (
    <div className="mt-20 ">
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center text-[#7541EE] 
       relative z-20 py-6 "
      >
      How We Designed a Hassle-Free  <br />  <Cover >Pet Care Experience?</Cover>
      </h1>
      <TimelineDemo />
    </div>
  );
}
export default CoverDemo;