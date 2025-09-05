import React from 'react';

const Mission = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">
              QUALITY PRODUCTS WITH
              <span className="text-emerald-500 block">PASSION</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our passion translates into a meaningful shopping experience built on dedication and trust. We care about your well-being just as much as you do and are fully committed to helping you thrive. Your success is our success.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We offer a unique, high-quality grocery experience designed to keep you coming back. Your time is valuable, so we’ve made choosing and purchasing quality products both enjoyable and efficient.
            </p>
          </div>
          <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              FreshMart is a Toronto-based company driven by a passion for healthy innovation. With over five years of experience, we are a small but highly creative team offering fresh food and outstanding service tailored to your needs.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is simple: deliver beautifully crafted, intuitive shopping experiences through a blend of creativity, professionalism, and authenticity. We believe in meaningful interactions and high-quality service that leave a lasting impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
