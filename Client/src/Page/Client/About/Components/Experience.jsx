import React from 'react';

const Experience = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Card */}
          <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              FRESHMART HAS EXPERIENCE
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We combine innovation and deep industry knowledge to redefine the grocery retail experience with seamless, customer-focused solutions.
            </p>
          </div>

          {/* Right Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Our Journey</h3>
            <div className="space-y-4">
              {[
                {
                  year: "2020 - Founded",
                  text: "Launched in Toronto as a small fresh food startup."
                },
                {
                  year: "2021 - Expansion",
                  text: "Grew our product line and delivery capabilities to meet growing demand."
                },
                {
                  year: "2023 - Innovation",
                  text: "Introduced eco-friendly packaging as part of our sustainability efforts."
                },
                {
                  year: "Today - Excellence",
                  text: "Proudly serving thousands of loyal customers across the region every day."
                }
              ].map((milestone, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{milestone.year}</h4>
                    <p className="text-gray-600">{milestone.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
