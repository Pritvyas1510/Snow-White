import React from 'react'

const About = () => {
    return (
        <section
            id="about"
            className="py-24 bg-gradient-to-br from-green-100 to-white"
        >
            <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Farm to Table Excellence
                    </h2>
                    <p className="text-lg text-gray-700 mt-4">
                        At FreshMart, we believe in the power of fresh, organic produce. Our
                        journey began with a simple mission: to connect families with the finest
                        fruits and vegetables while supporting local farming communities.
                    </p>
                    <p className="text-lg text-gray-700 mt-4">
                        Every product is carefully selected, ensuring pesticide-free produce
                        from certified organic farms.
                    </p>
                    <a
                        href="/About"
                        className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow"
                    >
                        Learn More About Us
                    </a>
                </div>
                <div className="flex-1 relative">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                        alt="Vegetables"
                        className="rounded-xl shadow-lg"
                    />
                    <div className="absolute bottom-4 right-4 bg-green-700 text-white text-sm px-4 py-2 rounded-xl font-semibold shadow-lg text-center">
                        <strong className="text-xl block">500+</strong>
                        Happy Customers
                    </div>
                </div>
            </div>
        </section>

    )
}

export default About
