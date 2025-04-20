import React from 'react';
import { Award, Users, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-8 text-center">About HemAIDx</h1>
          
          <div className="bg-white rounded-lg shadow-xl p-12">
            <p className="text-xl text-gray-700 mb-8 text-center">
              HemAIDx is revolutionizing hematological diagnostics through cutting-edge 
              AI technology. Our mission is to make accurate blood analysis accessible, 
              efficient, and environmentally sustainable.
            </p>

            {/* Features Section */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              {[
                { icon: Award, title: "Excellence", desc: "Committed to highest standards in medical diagnostics" },
                { icon: Users, title: "Collaboration", desc: "Working with leading healthcare institutions" },
                { icon: Heart, title: "Care", desc: "Putting patient care at the heart of innovation" },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Technology Section */}
            <div className="relative mb-16">
              <h2 className="text-2xl font-bold text-secondary mb-8 text-center">Technology</h2>
              <div className="absolute inset-x-0 -bottom-4 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Deep Learning Model",
                  desc: "Utilizing state-of-the-art AI to enhance white blood cell classification.",
                  image: "/data/classification-icon-in-illustration-vector.jpg"
                },
                {
                  title: "Generative AI",
                  desc: "Advanced neural networks for enhancing microscopy imaging.",
                  image: "/data/18220396.png"
                }
              ].map((tech, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                    {/* Image */}
                    <div className="relative h-36 mb-4 flex justify-center items-center">
                      <img src={tech.image} alt={tech.title} className="w-28 h-28 object-contain rounded-lg" />
                    </div>
                    <h3 className="text-lg font-semibold text-center text-secondary mb-2">
                      {tech.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Collaborators Section */}
            <div className="relative mb-16 mt-10">
              <h2 className="text-2xl font-bold text-secondary mb-8 text-center">Collaborators</h2>
              <div className="absolute inset-x-0 -bottom-4 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">

              {[
                { name: "Pakistan Institute of Medical Sciences", link: "https://pims.gov.pk/", image: "/data/brand.gif" },
                { name: (<span>RISETECH <br /> PVT. LTD.</span>), link: "https://risetech.ai/", image: "/data/images.png" },
                { name: "NUST School of Health Sciences", link: "https://nshs.nust.edu.pk/", image: "/data/images (1).png" }
                
              ].map((collaborator, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                    {/* Image */}
                    <div className="relative h-36 mb-4 flex justify-center items-center">
                      <img src={collaborator.image} alt={collaborator.name} className="w-28 h-28 object-contain rounded-lg" />
                    </div>
                    <h3 className="text-lg font-semibold text-center text-secondary mb-2">
                      <a href={collaborator.link} target="_blank" rel="noopener noreferrer">{collaborator.name}</a>
                    </h3>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
