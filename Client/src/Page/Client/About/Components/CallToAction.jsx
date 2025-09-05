import React from 'react';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-emerald-500 to-green-600 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Experience the FreshMart Difference?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of satisfied customers who trust us for their grocery
          needs. Fresh, organic, and sustainable — delivered right to your
          doorstep.
        </p>
        <button
          className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full text-lg transition-transform duration-300 hover:scale-105"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
