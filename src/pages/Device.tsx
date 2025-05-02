import React, { useRef, useState } from 'react';
import { Microscope, Zap, Camera, FlaskRound as Flask, Loader2, Network } from 'lucide-react';
import axios from 'axios';

const Device = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<'stain' | 'classify' | 'both' | null>(null);
  const [stainedImage, setStainedImage] = useState<string | null>(null);
  const [classifiedImage, setClassifiedImage] = useState<string | null>(null);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setStainedImage(null);
        setClassifiedImage(null);
        setProcessingType(null);
      }
    }
  };

  const processImage = async (type: 'stain' | 'classify' | 'both') => {
    if (!capturedImage) return;

    setProcessingType(type);
    setProgress(0);
    setError(null);

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);

      if (type === 'stain' || type === 'both') {
        const stainResponse = await axios.post('http://localhost:8000/virtual-staining/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percent);
          }
        });

        const stainedUrl = URL.createObjectURL(stainResponse.data);
        setStainedImage(stainedUrl);

        if (type === 'both') {
          const stainedFormData = new FormData();
          stainedFormData.append('file', new File([stainResponse.data], 'stained_image.jpg'));
          await processClassification(stainedFormData);
        }
      }

      if (type === 'classify' || type === 'both') {
        const formDataToUse = type === 'both' ? 
          new FormData().append('file', new File([await (await fetch(stainedImage)).blob()], 'stained_image.jpg')) :
          formData;

        await processClassification(formDataToUse);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Processing failed');
    } finally {
      setProcessingType(null);
      setProgress(0);
    }
  };

  const processClassification = async (formData: FormData) => {
    try {
      const classifyResponse = await axios.post('http://localhost:8000/classify/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        }
      });

      const classifiedUrl = URL.createObjectURL(classifyResponse.data);
      setClassifiedImage(classifiedUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Classification failed');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container mx-auto px-4 py-16">
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
            <div className="flex-1 min-h-[500px] flex flex-col items-center">
              <div className="relative w-[70%] h-[600px] overflow-hidden rounded-lg mb-6">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  muted
                >
                  <source src="/data/hardware.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={captureFrame}
                  className="absolute bottom-4 right-4 bg-secondary text-white p-3 rounded-full hover:bg-secondary-dark transition-colors"
                >
                  <Camera className="w-6 h-6" />
                </button>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {capturedImage && (
                <div className="w-full max-w-4xl bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start gap-8">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-4">Captured Image</h3>
                      <img
                        src={capturedImage}
                        alt="Captured frame"
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Processing Options</h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Note: For classification, please ensure the blood smear is already stained. 
                          For staining, use unstained blood smear only. 
                          Try both Staining & Classification on unstained blood smear.
                        </p>
                        <div className="space-y-4">
                          <button
                            onClick={() => processImage('stain')}
                            disabled={!!processingType && processingType !== 'stain'}
                            className={`w-full flex items-center justify-center gap-3 bg-secondary/90 text-white py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                              processingType === 'stain' ? 'opacity-50 cursor-wait' : 'hover:bg-secondary'
                            }`}
                          >
                            {processingType === 'stain' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Flask className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                              {processingType === 'stain' ? 'Processing...' : 'Virtual Staining'}
                            </span>
                          </button>

                          <button
                            onClick={() => processImage('classify')}
                            disabled={!!processingType && processingType !== 'classify'}
                            className={`w-full flex items-center justify-center gap-3 bg-secondary/90 text-white py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                              processingType === 'classify' ? 'opacity-50 cursor-wait' : 'hover:bg-secondary'
                            }`}
                          >
                            {processingType === 'classify' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Network className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                              {processingType === 'classify' ? 'Processing...' : 'Classify Cells'}
                            </span>
                          </button>

                          <button
                            onClick={() => processImage('both')}
                            disabled={!!processingType}
                            className={`w-full flex items-center justify-center gap-3 bg-secondary text-white py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                              processingType ? 'opacity-50 cursor-wait' : 'hover:bg-secondary-dark'
                            }`}
                          >
                            {processingType === 'both' ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Microscope className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                              {processingType === 'both' ? 'Processing...' : 'Stain & Classify'}
                            </span>
                          </button>
                        </div>

                        {(processingType || error) && (
                          <div className="mt-6">
                            {processingType && (
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-secondary rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                            {error && (
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(stainedImage || classifiedImage) && (
                    <div className="mt-8 space-y-6">
                      {stainedImage && (
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Stained Image</h4>
                          <img
                            src={stainedImage}
                            alt="Stained Result"
                            className="w-full max-h-[60vh] object-contain border rounded-lg"
                          />
                        </div>
                      )}
                      {classifiedImage && (
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Classified Image</h4>
                          <img
                            src={classifiedImage}
                            alt="Classified Result"
                            className="w-full max-h-[60vh] object-contain border rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

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
                High-resolution imaging system with precise focus control for detailed blood cell analysis.
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
                Instant analysis and staining simulation powered by advanced AI algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Device;