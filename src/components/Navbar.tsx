import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white px-6 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-gray-800 hover:text-secondary transition-colors ${isActive ? 'font-semibold text-secondary' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `text-gray-800 hover:text-secondary transition-colors ${isActive ? 'font-semibold text-secondary' : ''}`
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              `text-gray-800 hover:text-secondary transition-colors ${isActive ? 'font-semibold text-secondary' : ''}`
            }
          >
            Contact Us
          </NavLink>
        </div>
        <NavLink 
          to="/try-now" 
          className="bg-secondary text-white px-6 py-2 rounded-full hover:bg-secondary-dark transition-colors"
        >
          Try Now
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;