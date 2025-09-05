import React from 'react'

const HeroSection = () => {
    return (
        <section className="flex md:flex-row flex-col items-center justify-between min-h-[500px] bg-[#eaeaea] relative overflow-hidden">
            {/* Curved Left Section - Rounded only on md and above */}
            <div className="relative w-full md:w-[750px] max-w-4xl h-[300px] md:h-[600px] overflow-hidden 
                  shadow-lg 
                  rounded-none md:rounded-tr-[50%_100%] md:rounded-br-[50%_100%]">
                {/* Background Image */}
                <img
                    src="/Image/showcase-1.webp"
                    alt="Fresh Fruits"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/100 to-transparent flex flex-col justify-end" />
            </div>

            {/* Text Content */}
            <div className="w-full md:flex-1 text-center px-6 py-12 text-[#333] z-[2]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2e7d32] mb-5">
                    Fresh Fruits Delivered
                </h1>
                <p className="text-base sm:text-lg leading-relaxed mb-6 max-w-[500px] mx-auto text-[#333]">
                    Enjoy nature’s sweetness at your doorstep. 100% fresh, handpicked, and organic fruits for a healthier you.
                </p>
                <a href="/shop">
                    <button className="bg-[#ffdd00] text-[#333] px-6 py-3 rounded-md font-semibold text-base shadow-md hover:bg-[#f4c600] transition duration-300">
                        Shop Now
                    </button>
                </a>
            </div>
        </section>
    )
}

export default HeroSection
