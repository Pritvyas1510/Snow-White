import React from 'react'

const Products = () => {
    return (
        <section className="py-24 px-8 bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h2>
                <p className="text-xl text-gray-500 mb-12">
                    Discover our fresh and organic selection
                </p>
                {/* Category Grid */}
                <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch">
                    {/* Vegetables */}
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.06)] transform transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] cursor-pointer">
                        <div className="w-full h-full">
                            <img
                                src="/Image/Vagetable.jpeg"
                                alt="Fresh Vegetables"
                                className="w-full h-full object-cover  max-h-[320px] transition-transform duration-400 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[rgba(22,163,74,0.95)] to-transparent text-white text-left transition duration-300">
                                <h3 className="text-xl font-bold mb-2 tracking-wide">VEGETABLES</h3>
                                <p className="text-base mb-4 text-[#f0fdf4]">
                                    A selection of premium, locally sourced vegetables. Perfect for
                                    healthy cooking and salads.
                                </p>
                                <a
                                    href="/shop"
                                    className="inline-block bg-yellow-400 text-gray-800 px-5 py-2.5 text-sm font-semibold rounded-md uppercase tracking-wider transition duration-300 hover:bg-yellow-300 hover:text-gray-900"
                                >
                                    Shop Now
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Fruits */}
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.06)] transform transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] cursor-pointer">
                        <div className="w-full h-full">
                            <img
                                src="/Image/fruits.jpeg"
                                alt="Fresh Fruits"
                                className="w-full h-full object-cover max-h-[320px] transition-transform duration-400 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[rgba(22,163,74,0.95)] to-transparent text-white text-left transition duration-300">
                                <h3 className="text-xl font-bold mb-2 tracking-wide">FRUITS</h3>
                                <p className="text-base mb-4 text-[#f0fdf4]">
                                    Fresh and sweet seasonal fruits. Perfect for healthy snacking and
                                    desserts.
                                </p>
                                <a
                                    href="/shop"
                                    className="inline-block bg-yellow-400 text-gray-800 px-5 py-2.5 text-sm font-semibold rounded-md uppercase tracking-wider transition duration-300 hover:bg-yellow-300 hover:text-gray-900"
                                >
                                    Shop Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* CTA Button */}
                <div className="mt-16">
                    <a
                        href="/shop"
                        className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-300"
                    >
                        View All Products
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Products
