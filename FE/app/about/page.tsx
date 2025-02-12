'use client'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

import Link from "next/link";

import {motion} from "framer-motion";
import {useState} from "react";
export default function AboutPage() {


  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-neon-blue"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        About Neon Lights
      </motion.h1>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image

              src='/product-2.jpg'
            alt="Neon Lights Workshop"
            width={300}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-neon-pink">Our Story</h2>
          <p className="text-gray-300 mb-4">
            Founded in 2010, Neon Lights has been at the forefront of bringing vibrant, custom-made neon signs to homes and businesses around Vietnam. Our passion for craftsmanship and dedication to quality has made us a leader in the neon lighting industry.
          </p>
          <p className="text-gray-300 mb-4">
            What started as a small workshop in Ho Chi Minh City has grown into a nationwide brand, but our commitment to handcrafted quality and personal service remains unchanged.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="text-center mb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-neon-yellow">Our Mission</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          At Neon Lights, our mission is to illuminate Vietnam with creativity. We believe that lighting is more than just functionality – its an art form that can transform spaces and evoke emotions. Our goal is to provide unique, high-quality neon products that allow our customers to express their individuality and bring their visions to life.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-3 text-neon-blue">Craftsmanship</h3>
          <p className="text-gray-300">
            Each of our neon signs is handcrafted by skilled artisans with years of experience. We take pride in the quality and durability of our products.
          </p>
        </motion.div>
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-xl font-semibold mb-3 text-neon-pink">Customization</h3>
          <p className="text-gray-300">
            We offer a wide range of customization options. From colors to sizes, we work closely with our customers to bring their ideas to light.
          </p>
        </motion.div>
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h3 className="text-xl font-semibold mb-3 text-neon-yellow">Sustainability</h3>
          <p className="text-gray-300">
            We are committed to reducing our environmental impact. Our LED neon alternatives offer the same vibrant glow with improved energy efficiency.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-neon-blue">Ready to Light Up Your World?</h2>
        <Button asChild className="bg-neon-pink hover:bg-neon-pink/80 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-glow-pink text-lg">
          <Link href="/products">Explore Our Products</Link>
        </Button>
      </motion.div>
    </div>
  )
}

