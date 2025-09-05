import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 px-4 sm:px-6 py-10">
      {/* Top Section: Logo | Nav | Icons */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center text-center md:text-left gap-y-6 md:gap-y-0">
        {/* Left: Logo */}
        <div className="flex justify-center md:justify-start items-center space-x-2">
          <img
            src="/Image/white snow (3).png"
            alt="White Snow Logo"
            className="h-15 w-auto"
          />
        </div>

        {/* Center: Navigation */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center my-10 justify-center">
          <input
            type="email"
            placeholder="Enter Your Email Address"
            className="w-full sm:w-2/3 px-4 py-[8px] border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-[11px] rounded-md sm:rounded-r-md sm:rounded-l-none font-semibold text-sm">
            SUBSCRIBE
          </button>
        </div>
        {/* Right: Social Icons */}
        <div className="flex justify-center md:justify-end space-x-4 text-xl text-gray-600">
          <a href="#" className="hover:text-blue-600">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-black">
            <FaXTwitter />
          </a>
        </div>
      </div>

      {/* Subscribe Section */}

      {/* Divider */}
      <hr className="my-8 border-gray-200" />

      {/* Copyright */}
      <p className="text-sm text-gray-400 text-center">
        © {new Date().getFullYear()} White Snow. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
