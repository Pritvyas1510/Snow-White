import React from 'react'

const Features = () => {
    return (
        <section className="bg-gradient-to-br from-green-50 to-yellow-50 py-20 text-center">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FreshMart?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">We're committed to bringing you the freshest, highest quality produce directly from local farms to your table.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-2 transition transform">
                        <div className="text-3xl">🚚</div>
                        <h3 className="text-green-700 text-xl font-semibold mt-4">Free Delivery</h3>
                        <p className="mt-2 text-gray-600">Free delivery on orders over $50</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-2 transition transform">
                        <div className="text-3xl">🛡️</div>
                        <h3 className="text-green-700 text-xl font-semibold mt-4">100% Fresh</h3>
                        <p className="mt-2 text-gray-600">Quality guaranteed or money back</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-2 transition transform">
                        <div className="text-3xl">🌿</div>
                        <h3 className="text-green-700 text-xl font-semibold mt-4">Organic Certified</h3>
                        <p className="mt-2 text-gray-600">Certified organic produce only</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-2 transition transform">
                        <div className="text-3xl">👩‍🌾</div>
                        <h3 className="text-green-700 text-xl font-semibold mt-4">Local Farmers</h3>
                        <p className="mt-2 text-gray-600">Supporting local farming communities</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
