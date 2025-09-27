import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Company Info */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-xl font-bold">Government Authority</h2>
          <p className="text-sm text-indigo-100">
            Building smarter solutions for your everyday needs.
          </p>
          <p className="text-xs text-indigo-200">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="flex flex-col md:flex-row gap-4 text-sm">
          <a href="#home" className="hover:text-yellow-300 transition">Home</a>
          <a target="_blank" href="https://ichandrashekhar.vercel.app" className="hover:text-yellow-300 transition">About</a>
          <a href="#services" className="hover:text-yellow-300 transition">Services</a>
          <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4 text-lg">
          <a href="#" className="hover:text-yellow-300 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-yellow-300 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-yellow-300 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-yellow-300 transition"><FaLinkedinIn /></a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-6 border-t border-indigo-300 pt-4 text-center text-xs text-indigo-200">
        Designed with ❤️ by Developer
      </div>
    </footer>
  );
};

export default Footer;
