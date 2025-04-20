import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, ArrowRight, CheckCircle } from "lucide-react";

const Classification = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Simulate processing steps based on backend workflow
      const progressSteps = [
        { step: "Uploading", value: 20 },
        { step: "Resizing image", value: 40 },
        { step: "Running detection", value: 60 },
        { step: "Drawing annotations", value: 80 },
      ];

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const nextStep = progressSteps.find(s => s.value > prev);
          return nextStep ? nextStep.value : prev;
        });
      }, 1000);

      const response = await axios.post("http://localhost:8000/classify/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      clearInterval(progressInterval);
      setProgress(100);

      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl);
      
      setTimeout(() => setProgress(0), 2000);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please check backend logs.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">Classification of Blood Cells</h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Stained Blood Slide Image</h3>
          <p className="text-gray-500 mb-4">Supported formats: PNG, JPG, TIFF (max 10MB)</p>

          <input
            type="file"
            className="hidden"
            id="slideUpload"
            accept="image/*"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] || null);
              setProgress(0);
            }}
          />
          <label
            htmlFor="slideUpload"
            className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg cursor-pointer inline-block transition-colors"
          >
            Select File
          </label>
        </div>

        {selectedFile && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Selected File:</h4>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <span>{selectedFile.name}</span>
              <button
                onClick={handleUpload}
                className="relative bg-primary hover:bg-primary-light text-secondary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors overflow-hidden w-32 justify-center"
                disabled={loading || progress === 100}
              >
                <div 
                  className="absolute inset-0 bg-primary-dark transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? '#4CAF50' : '#d6336c',
                    transition: progress === 100 ? 'background-color 0.3s' : 'width 0.3s'
                  }}
                />
                <div className="relative z-10 flex items-center gap-2">
                  {progress === 100 ? (
                    <>
                      <CheckCircle size={16} />
                      Done!
                    </>
                  ) : (
                    <>
                      {loading ? "Processing..." : "Process"}
                      {!loading && <ArrowRight size={16} />}
                    </>
                  )}
                </div>
              </button>
            </div>
            {loading && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-secondary rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {progress < 20 && "Starting processing..."}
                  {progress >= 20 && progress < 40 && "Resizing image..."}
                  {progress >= 40 && progress < 60 && "Detecting cells..."}
                  {progress >= 60 && progress < 80 && "Drawing annotations..."}
                  {progress >= 80 && "Finalizing results..."}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {processedImage && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Classification Results:</h4>
            <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
              <img 
                src={processedImage} 
                alt="Analyzed Result" 
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classification;