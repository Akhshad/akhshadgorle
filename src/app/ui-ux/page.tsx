"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../components/ui/lamp";
import Link from "next/link";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import Footer from "../components/Footer";

type Project = {
  title: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  external: boolean;
  glow: string;
};

const projects: Project[] = [
  {
    title: "TourIQ",
    description:
      "Dynamic pricing for tour and activity operators. Every departure is priced on what its day is worth, with approved prices pushed straight to FareHarbor and Peek Pro.",
    image: "/images/projects/touriq.png",
    href: "https://touriq.ai",
    cta: "Visit site",
    external: true,
    glow: "hover:shadow-orange-500/[0.8]",
  },
  {
    title: "RED Hospitality & Leisure",
    description:
      "A global leader in experiential tourism and resort services, spanning watersports, eco-tourism and destination services across Hawaii and the Caribbean.",
    image: "/images/projects/red-hospitality.png",
    href: "https://www.experiencered.com",
    cta: "Visit site",
    external: true,
    glow: "hover:shadow-red-500/[0.8]",
  },
  {
    title: "Z Transform Media",
    description:
      "A one-stop marketing studio for websites, branding and growth, helping ambitious businesses build, grow and scale in the digital world.",
    image: "/images/projects/ztransformmedia.png",
    href: "https://ztransformmedia.com",
    cta: "Visit site",
    external: true,
    glow: "hover:shadow-violet-500/[0.8]",
  },
  {
    title: "FauxSwoosh",
    description: "FauxSwoosh is a meticulously crafted replica of the Nike website.",
    image: "/N1.jpg",
    href: "https://www.figma.com/design/v5zfY7JTTvLLkMZdHU0V9v/Nike?node-id=0%3A1&t=1UpM3CLgi5IgmISe-1",
    cta: "View",
    external: true,
    glow: "hover:shadow-purple-500/[0.8]",
  },
  {
    title: "Smart Work Permit Dashboard",
    description:
      "A Smart Work Permit is a digital system that streamlines the issuance and management of work permits, enhancing efficiency and compliance.",
    image: "/SWP-1.png",
    href: "https://www.figma.com/design/ndK01grPokubyjS9mvJtv8/Smart-Work-Permit?node-id=4%3A2&t=zc9x7PEkQEodFpWi-1",
    cta: "View",
    external: true,
    glow: "hover:shadow-green-500/[0.8]",
  },
  {
    title: "SUZDO",
    description: "A car washing brand.",
    image: "/SZ1.png",
    href: "https://www.figma.com/design/G72Qou8rNz4e7tN5QmW19b/Sudzo?node-id=0%3A1&t=57BRgG8LizKaF9r8-1",
    cta: "View",
    external: true,
    glow: "hover:shadow-yellow-500/[0.8]",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <CardContainer className="inter-var w-full h-full" containerClassName="py-0 w-full h-full">
      <CardBody
        className={`relative group/card flex flex-col w-full h-full bg-black border border-white/[0.15] rounded-xl p-5 sm:p-6 hover:shadow-2xl ${project.glow}`}
      >
        <CardItem translateZ="50" className="text-lg sm:text-xl font-bold text-white">
          {project.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-400 text-sm mt-2 w-full"
        >
          {project.description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl">
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-top group-hover/card:shadow-xl"
            />
          </div>
        </CardItem>
        <div className="flex justify-end items-center mt-auto pt-6">
          <CardItem
            translateZ={20}
            as={Link}
            href={project.href}
            target={project.external ? "_blank" : undefined}
            rel={project.external ? "noopener noreferrer" : undefined}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
          >
            {project.cta} &rarr;
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

function UiUx() {
  return (
    <>
      <LampContainer className="">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8"
        >
          UI/UX Design
        </motion.h1>
      </LampContainer>

      <div>
        <h3 className="mt-20 text-4xl sm:text-7xl text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-black py-8">
          Projects
        </h3>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
      <Footer />
    </>
  );
}

export default UiUx;
