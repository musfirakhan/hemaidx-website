import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Network } from 'lucide-react';  // Updated Icon

const TryNow = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Try HemAIDx</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link 
              to="/try-now/staining" 
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow"
            >
              <div className="text-center">
                <Microscope className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">Virtual Staining</h2>
                <p className="text-gray-600">
                  Transform unstained blood smear images into high-quality, virtually stained samples 
                  using Generative AI.
                </p>
              </div>
            </Link>

            <Link 
              to="/try-now/classification" 
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow"
            >
              <div className="text-center">
                <Network className="w-16 h-16 text-secondary mx-auto mb-4" /> {/* Updated Icon */}
                <h2 className="text-2xl font-semibold mb-4">Cell Classification</h2>
                <p className="text-gray-600">
                  Automatically identify and classify different types of blood cells with 
                  high accuracy using machine learning.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryNow;
