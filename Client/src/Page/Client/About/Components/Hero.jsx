import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-green-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
          About Us
        </h1>
        <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Founded in 2020, FreshMart has evolved from a small, creative fresh food company into a
          trusted provider of high-quality products and exceptional customer service. Through
          careful product selection and attention to detail, we deliver a delightful shopping
          experience—balancing quality, convenience, and sustainability for every customer.
        </p>
      </div>
    </section>
  );
};

export default Hero;
