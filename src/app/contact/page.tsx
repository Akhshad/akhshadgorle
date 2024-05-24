// Contact.js
'use client'
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

function Contact() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="max-w-md w-full mx-auto border border-neutral-800 md:rounded-2xl 
      p-4 md:p-8 shadow-input bg-black dark:bg-black mt-20">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Get in Touch
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Tyler"
                type="text"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Durden"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="projectmayhem@fc.com"
              type="email"
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="bg-neutral-800 text-neutral-400
               border-gray-300 rounded-md shadow-sm focus:border-indigo-500
                focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              cols={20}
              rows={10}
              placeholder="Message"
            />
          </div>
          <button
            className="bg-gradient-to-br relative group/btn from-black
             dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block
              dark:bg-zinc-800 w-full text-white rounded-md h-10 mt-4 font-medium 
              shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] 
              dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Submit &rarr;
          </button>
        </form>
      </div>
    </>
  );
}

export default Contact;
