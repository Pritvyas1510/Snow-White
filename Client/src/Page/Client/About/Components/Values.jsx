import React from 'react';
import { Users, Award, Leaf, Lightbulb } from 'lucide-react';

const Values = () => {
  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. We build lasting relationships by consistently exceeding expectations."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "We uphold the highest standards by selecting only premium products and delivering exceptional service."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "From sourcing to delivery, we prioritize eco-friendly practices to protect our planet and future generations."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace innovation to enhance our services, streamline processes, and provide outstanding customer experiences."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide our mission, drive our decisions, and inspire our growth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
