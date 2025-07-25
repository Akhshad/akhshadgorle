import Image from "next/image";
import React from "react";
import { Timeline } from "@/app/components/ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Design Strategy",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
          A structured approach that aligns user needs, business goals, and innovation to create effective, scalable, and user-centric design solutions through research, planning, and iterative refinement.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/Design_Strategy.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
    {
      title: "Competitor Analysis",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
          A strategic evaluation of rival businesses, their strengths, weaknesses, and market positioning 
          to identify opportunities, gaps, and advantages for creating a more competitive and user-centric 
          solution.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/Competitve_Analysis.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
         
        </div>
      ),
    },
    {
      title: "User Research",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
          A systematic process of gathering insights about user behaviors, needs, and pain points to design
           solutions that are data-driven, user-focused, and problem-solving rather than assumption-based.
          </p>
         
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/User_Research.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
    // ✅ Only showing relevant parts that were changed:

{
  title: "Persona",
  content: (
    <div>
      <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
        A representation of the target audience so that designers are designing
        for a specific audience instead of a generic one.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <Image
          src="/images/Persona.png"
          alt="startup template"
          width={1000}
          height={500}
          className="rounded-lg object-contain w-full h-auto 
          shadow-[...]"
        />
      </div>
    </div>
  ),
},
{
  title: "Empathy Map",
  content: (
    <div>
      <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
        A representation of the target audience so that designers are designing
        for a specific audience instead of a generic one.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <Image
          src="/images/Empathy_Map.png"
          alt="startup template"
          width={1000}
          height={500}
          className="rounded-lg object-contain w-full h-auto 
          shadow-[...]"
        />
      </div>
    </div>
  ),
},
{
  title: "Journey Map",
  content: (
    <div>
      <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
        A visual tool used to understand a user&apos;s thoughts, feelings, behaviors, and challenges,
        helping designers create human-centered solutions based on real user insights rather than assumptions.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <Image
          src="/images/Journey_Map.png"
          alt="startup template"
          width={1000}
          height={500}
          className="rounded-lg object-contain w-full h-auto 
          shadow-[...]"
        />
      </div>
    </div>
  ),
},

    {
      title: "Task Flow",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
          A step-by-step visual representation of the user's actions to complete a specific goal, 
          outlining key decisions, interactions, 
          and pathways to optimize efficiency and improve the overall user experience.
          </p>
         
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/Task_Flow.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
    {
      title: "User Flow",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
          A visual representation of the user's journey through a system, mapping out various pathways, interactions,
           and decision points to ensure a smooth and intuitive experience tailored to user needs.
          </p>
         
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/User_Flow.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
    {
      title: "Card Sorting",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
          A user research method that involves organizing information into categories based on user perception, 
          helping designers create intuitive navigation structures and improve information architecture for a seamless user experience.
          </p>
         
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/Card_Sorting.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
    {
      title: "Information Architecture",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
          A low-fidelity visual representation of a digital interface, created as sketches or digital layouts, outlining structure,
           hierarchy, and functionality to establish the user experience before design and development.
          </p>
         
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/Information_Architecture.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
    {
      title: "Wireframes",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-4">
          The structural design of information within a system, organizing content, navigation, and hierarchy 
          to enhance usability, accessibility, and user experience.
          </p>
         
          <div className="grid grid-cols-1 gap-4">
            <Image
               src="/images/Wireframes.png"
               alt="startup template"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
      <div>
      <Image
               src="/images/Thank_You.png"
               alt="thank you"
               width={1000}
               height={500}
               className="rounded-lg object-contain w-full h-auto 
               shadow-[0_0_24px_rgba(34,_42,_53,_0.06),
               _0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),
               _0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)
               ,_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"/>    
      </div>
    </div>
  );
}
