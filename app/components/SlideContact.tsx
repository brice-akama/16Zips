"use client";

import { useState } from "react";          
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp Icon Import

export default function SlideContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [statusMessage, setStatusMessage] = useState(""); // To show success or error message
  const [showButtons, setShowButtons] = useState(true);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setStatusMessage("Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" }); // Clear the form after success
    } else {
      setStatusMessage(data.error || "An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Vertical Buttons Group */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col items-start z-[9999] mt-20">
  {/* Toggle Button (Always Visible) */}
  


  
  {/* Show Contact + WhatsApp Buttons only when isOpen is false */}
  {!isOpen &&  showButtons && (
    <>
      {/* Contact Us Button */}

      
      
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-r-none shadow-lg hover:bg-blue-700 transition transform -rotate-90 origin-top-left"
      >
        Contact Us
      </button>

      {/* WhatsApp Button */}
      <Link
        href="https://wa.me/237681152712"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-3 py-2 rounded-r-none shadow-lg hover:bg-green-700 transition transform -rotate-90 origin-top-left"
      >
        <FaWhatsapp size={24} />
      </Link>
    </>

    
  )}
 {/* Arrow Toggle Button (Absolutely Positioned On Top) */}
 <button
      onClick={() => setShowButtons((prev) => !prev)}
      className="absolute -top-28 left-0 z-50 bg-gray-800 text-white px-3 py-2 shadow-lg hover:bg-gray-700 transition -rotate-90 origin-top-left mt-1 "
    >
      {showButtons ? '→' : '←'}
    </button>
   
</div>

      {/* Slide-out Form */}
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.4 }}
          className="fixed left-0 top-0 h-[480px] w-80 bg-white shadow-lg p-6 mt-20 overflow-y-auto"

        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-black mt-20"
          >
            <X size={24} />
          </button>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-20">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="border rounded-lg p-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="border rounded-lg p-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              className="border rounded-lg p-2"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Send Message
            </button>
          </form>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-4 text-center text-lg text-green-600">
              {statusMessage}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}