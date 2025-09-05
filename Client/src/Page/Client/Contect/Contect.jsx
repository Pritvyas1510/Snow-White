import React from 'react';

const Contact = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="bg-white p-8 shadow-xl rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Message</label>
              <textarea
                rows="5"
                placeholder="Your message..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Map and Info */}
        <div className="space-y-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4918579702033!2d-79.38393468450264!3d43.6534819791211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d65d51b6e5%3A0x695b1b456a7e23c7!2sDowntown%20Toronto!5e0!3m2!1sen!2sca!4v1636700549611!5m2!1sen!2sca"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
            className="rounded-2xl shadow-lg"
          ></iframe>

          <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Address</h3>
              <p className="text-gray-600">123 Main Street, Toronto, ON, Canada</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Phone</h3>
              <p className="text-gray-600">+1 (416) 555-1234</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Email</h3>
              <p className="text-gray-600">contact@freshmart.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
