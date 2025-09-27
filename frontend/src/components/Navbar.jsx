import React from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white shadow-lg px-6 py-3 flex items-center justify-between">
      {/* Left Side - Logo / Project Name */}
      <div className="text-xl font-bold tracking-wide">
        Civic<span className="text-green-400">Connect</span>
      </div>

      {/* Center - Navigation Links */}
      <div className="hidden md:flex space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/create-report" className="hover:text-gray-300">Report Issue</Link>
        <Link to="/check-status" className="hover:text-gray-300">Check report status</Link>
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
      </div>

      {/* Right Side - Profile / Actions */}
      <div className="flex items-center space-x-4">
        <button className="hidden md:inline px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 text-sm font-medium">
          Report Now
        </button>
        <button className="hidden md:inline px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm">
          Login
        </button>
        <Menu className="md:hidden cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
