"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Blog {
  id: number
  title: string
  author: string
  date: string
  image: string
  avatar: string
  link: string
}

const blogs: Blog[] = [
  {
    id: 1,
    title: 'How We Designed a Hassle-Free Pet Care Experience?',
    author: 'Woofy`s Case Study',
    date: '12.10.1999',
    image: '/images/Truck.png', // Local image path
    avatar: '/images/A.jpg', // Local avatar path
    link: '/case_study',
  },
  {
    id: 2,
    title: 'Building Websites with more Perfection than ‘Pivot!’ Execution.',
    author: 'Web Development  ',
    date: '05.07.2023',
    image: '/images/WebD.png', // Local image path
    avatar: '/images/A.jpg', // Local avatar path
    link: '/wd',
  },
  {
    id: 3,
    title: 'From ‘Could this be more Confusing?’ to an Effortlessly Intuitive UI.',
    author: 'Woofy`s Ui',
    date: '18.03.2021',
    image: '/images/Woofys-Ui.png',// Local image path
    avatar: '/images/A.jpg',// Local avatar path
    link: '/ios_ui',
  },
  {
    id: 4,
    title: ' Where Pixels Meets Purpose, & Design Feels like Magic.',
    author: 'Graphic Design',
    date: '24.12.2022',
    image: '/Frame.png', // Local image path
    avatar: '/images/A.jpg', // Local avatar path
    link: '/gd',
  },
  {
    id: 5,
    title: 'Designs that Don’t Just Look Good—They Leave a Mark',
    author: 'UX/UI Design',
    date: '02.11.2024',
    image: '/images/M.png', // Local image path
    avatar: '/images/A.jpg', // Local avatar path
    link: '/ui-ux',
  },
]

export default function SolidBento() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
       <p className="d text-4xl sm:text-7xl text-center font-bold relative  bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-800 py-8">
       Design. Develop. Elevate!
      </p> 
    <div className="grid max-h-screen h-auto p-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4">
      {blogs.map((blog, index) => (
        <Link
          key={blog.id}
          href={blog.link}
          className={`group relative flex overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
            index === 0
              ? 'md:col-span-2 md:row-span-2'
              : index === 1
              ? 'md:col-span-1 md:row-span-1'
              : 'md:col-span-1 md:row-span-1 lg:row-span-2'
          }`}
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="transition-all duration-300 group-hover:scale-110 group-hover:opacity-50 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="relative flex h-full w-full flex-col justify-end p-6 text-white">
            <h2 className="mb-2 text-2xl font-bold leading-tight">{blog.title}</h2>
            <div className="flex items-center space-x-2">
              <Image
                src={blog.avatar}
                alt={blog.author}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium">{blog.author}</span>
              <span className="text-xs text-gray-300">{blog.date}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
    </div>
  )
}
