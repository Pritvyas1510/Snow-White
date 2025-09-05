import React from 'react'
import HeroSection from './Components/HeroSection'
import Product from './Components/Product'

const Shop = ({ products, favorites, setFavorites }) => {
  return (
    <>
     <HeroSection /> 
     <Product products={products} favorites={favorites} setFavorites={setFavorites} />
    </>
  )
}

export default Shop
