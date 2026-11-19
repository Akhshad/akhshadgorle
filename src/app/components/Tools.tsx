"use client";
import React, { useRef } from "react";
import { EvervaultCard, Icon } from "../components/ui/evervault-card";
import SpotlightBackground from "./SpotlightBackground";
import { useTextSpotlight } from "./SpotlightBackground/useTextSpotlight";

const groups = [
  {
    title: "Design",
    rows: [
      ["Illustrator", "Photoshop", "Figma", "Framer.ai"],
      ["After Effects", "Premiere Pro"],
    ],
  },
  {
    title: "Development",
    rows: [
      ["HTML", "CSS", "SCSS", "React.js", "Next.js"],
      ["Angular", "GSAP"],
    ],
  },
];

const Tools = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Text near the cursor fades to grey as the spotlight passes over it:
  // the heading, the card titles inside EvervaultCard, and the tool pills.
  useTextSpotlight(sectionRef, "[data-spotlight-text], .group\\/card span.z-20");

  return (
    <div ref={sectionRef} className="h-[50rem] w-full bg-black relative items-center justify-center">
      <SpotlightBackground />

      <p
        data-spotlight-text
        className="text-4xl sm:text-7xl text-center font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8"
      >
        Tools
      </p>

      <div className="flex gap-10 flex-col lg:flex-row relative">
        {groups.map((group, i) => (
          <div
            key={group.title}
            className={`border border-white/[0.2] mt-20 flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem] ${
              i === 0 ? "w-[40rem]" : ""
            }`}
          >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

            <EvervaultCard text={group.title} />

            {group.rows.map((row, r) => (
              <div key={r} className="flex gap-2">
                {row.map((tool) => (
                  <p
                    key={tool}
                    data-spotlight-text
                    className="text-sm border font-light border-white/[0.2] rounded-full mt-4 text-white px-2 py-0.5 hover:bg-gray-800"
                  >
                    {tool}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tools;
