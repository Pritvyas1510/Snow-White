import React from 'react'

const Contact = () => {
    return (
        <section
            id="contact"
            className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-center"
        >
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold">Ready to Start Your Healthy Journey?</h2>
                <p className="text-lg mt-4 text-green-100">
                    Join thousands of satisfied customers who trust FreshMart for their daily
                    fresh produce needs.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <a
                        href="/Shop"
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow"
                    >
                        Start Shopping
                    </a>
                    <a
                        href="/Contact"
                        className="border-2 border-white hover:bg-white hover:text-green-700 font-semibold px-6 py-3 rounded-lg transition"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Contact
