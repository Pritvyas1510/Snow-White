import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <div className="relative w-full h-[400px] bg-center bg-cover flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('/Image/hero.png')" }}>
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative z-20 text-white text-center max-w-xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide drop-shadow-lg">Discover Freshness, Delivered to You</h1>
        <p className="text-lg md:text-xl mb-4 drop-shadow">Shop the best fruits and vegetables, handpicked for quality and taste. Enjoy fast delivery and exclusive offers!</p>
        <button className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full text-lg shadow hover:bg-green-700 hover:text-white transition-colors duration-200">Shop Now</button>
      </div>
    </div>
  )
}

export default HeroSection
