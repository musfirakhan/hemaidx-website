import React from 'react';
import { PlayCircle } from 'lucide-react';


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <img 
              src="/data/png2.png"
              alt="HemAIDx Logo"
              className="mx-auto mb-8 w-128 h-62"
            />
            <h1 className="text-3xl text-black mb-6 italic" style={{ fontFamily: "sanserif" }}>
              A Portable Laboratory For Hematological Precision
             
            </h1>
          </div>
        </div>



        {/* Main Content */}
        <div className="max-w-6xl mx-auto pb-20">
          <div className="overflow-hidden rounded-lg">
            <div className="group relative cursor-pointer">
              <div className="flex transition-transform duration-500 ease-in-out transform group-hover:-translate-x-full">
                {/* First Section */}
                <div className="min-w-full bg-white rounded-lg shadow-xl p-12">
                  <div className="flex items-start justify-between gap-12">
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        AI-Powered Blood Cell Identification for Precision Diagnosis
                      </h2>
                      <p className="text-xl text-gray-600 mb-8">
                        AI-driven hematology solution revolutionizes 
                        blood cell identification, providing rapid detection 
                        of various blood disorders. Using AI technology,
                        we transform stained blood smear images into classified images for 
                        different types of White Blood Cells enhancing diagnostic precision. 
                      </p>
                    </div>
                    <div className="flex-1">
                      <video 
                        src="/data/video.mov" 
                        className="w-full h-[300px] object-cover rounded-lg"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    </div>
                  </div>
                </div>

                {/* Second Section */}
                <div className="min-w-full absolute top-0 left-full">
                  <div className="bg-white rounded-lg shadow-xl p-12">
                    <div className="flex items-start justify-between gap-12">
                      <div className="flex-1">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                          Virtual Staining of Unstained Blood Smear Images
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                        This advanced solution eliminates the need for traditional staining procedures, 
                        which are often time-consuming and costly. Instead, we provide an efficient, 
                        reagent-free method for analyzing blood samples. 
                        This not only enhances diagnostic precision but also 
                         reduces the manual workload involved in hematological analysis, 
                         making the process faster, safer, and more scalable for clinical use.


                        </p>
                      </div>
                      <div className="flex-1">
                        <video 
                          src="/data/proj.mov" 
                          className="w-full h-[300px] object-cover rounded-lg"
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Us Section */}
          <div className="text-center mb-16">
            <h2 className="inline-block bg-[#000080] text-white px-12 py-3 rounded-full text-2xl font-semibold">
              WHY US?
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <img 
                src="/data/fast-processing-icon-vector-54538570.jpg"
                alt="Fast Processing"
                className="mx-auto mb-4 w-24 h-24"
              />
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-600">Get results in seconds, not days</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <img 
                src="/data/3800899.png"
                alt="Accurate Results"
                className="mx-auto mb-4 w-24 h-24"
              />
              <h3 className="text-xl font-semibold mb-2">Accurate Results</h3>
              <p className="text-gray-600">AI-powered precision diagnostics</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <img 
                src="/data/eco-friendly-icon_933463-15104.avif"
                alt="Eco-Friendly"
                className="mx-auto mb-4 w-24 h-24"
              />
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">No chemical reagents needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;