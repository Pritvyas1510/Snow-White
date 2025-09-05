import React from 'react'
import HeroSection from './Components/heroSection'
import Features from './Components/Features'
import Products from './Components/Products'
import About from './Components/About'
import Contact from './Components/Contact'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Features />
      <Products />
      <About />
      <Contact />
    </div>
  )
}

export default Home
