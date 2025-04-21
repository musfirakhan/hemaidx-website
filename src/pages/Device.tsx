import React from 'react';
import { Microscope, Zap } from 'lucide-react';

const Device = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Smart Microscopy Device
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            An AI-integrated device featuring a microcontroller-based unit that can be seamlessly attached
            to a conventional microscope, enabling real-time blood slide
            analysis through automated staining and cell classification.
          </p>
        </div>

        <div className="max-w-[1100px] mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-12 mb-14 min-h-[800px] flex flex-col">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Real-time Staining & Classification
            </h2>
            <div className="flex-1 min-h-[500px]">
              {/* Video container */}
              <div className="w-full h-[600px] overflow-hidden rounded-lg">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  muted
                  disablePictureInPicture
                  controls={false}
                >
                  <source src="/data/hardware.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - Centered at Bottom */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center hover:shadow-2xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Microscope className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Advanced Optics
              </h3>
              <p className="text-gray-600">
                
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl text-center hover:shadow-2xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Real-time Processing
              </h3>
              <p className="text-gray-600">
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Device;
