import React, { useState } from "react";
import axios from "axios";
import { Upload, ArrowRight, CheckCircle } from "lucide-react";

const VirtualStaining = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stainedImageBlob, setStainedImageBlob] = useState<Blob | null>(null);
  const [stainedImageUrl, setStainedImageUrl] = useState<string | null>(null);
  const [classifiedImageUrl, setClassifiedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "staining" | "stained" | "classifying" | "done">("idle");

  const handleStaining = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setProgress(0);
    setError(null);
    setStage("staining");

    const formData = new FormData();
    formData.append("file", selectedFile);
    const stainSteps = [10, 30, 60, 90];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = stainSteps.find(p => p > prev);
        return next || prev;
      });
    }, 2000);

    try {
      const response = await axios.post("http://localhost:8000/virtual-staining/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      clearInterval(interval);
      setProgress(100);
      const blob = response.data;
      const url = URL.createObjectURL(blob);

      setStainedImageBlob(blob);
      setStainedImageUrl(url);
      setStage("stained");
    } catch (err) {
      setError("Virtual staining failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassification = async () => {
    if (!stainedImageBlob) return;

    setLoading(true);
    setProgress(0);
    setError(null);
    setStage("classifying");

    const classSteps = [20, 40, 60, 80];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = classSteps.find(p => p > prev);
        return next || prev;
      });
    }, 1000);

    try {
      const formData = new FormData();
      const fileFromBlob = new File([stainedImageBlob], "stained_image.png", { type: "image/png" });
      formData.append("file", fileFromBlob);

      const response = await axios.post("http://localhost:8000/classify/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      clearInterval(interval);
      setProgress(100);
      const url = URL.createObjectURL(response.data);
      setClassifiedImageUrl(url);
      setStage("done");
    } catch (err) {
      setError("Classification failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-secondary mb-8">
        Virtual Staining of Unstained Blood Slide
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Unstained Blood Slide Image</h3>
          <p className="text-gray-500 mb-4">Supported formats: PNG, JPG, TIFF (max 10MB)</p>

          <input
            type="file"
            className="hidden"
            id="uploadInput"
            accept="image/*"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] || null);
              setProgress(0);
              setStainedImageUrl(null);
              setClassifiedImageUrl(null);
              setStage("idle");
            }}
          />
          <label
            htmlFor="uploadInput"
            className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg cursor-pointer inline-block"
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
                onClick={stage === "stained" ? handleClassification : handleStaining}
                className="relative bg-primary hover:bg-primary-light text-secondary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors overflow-hidden w-32 justify-center"
                disabled={loading}
              >
                <div
                  className="absolute inset-0 bg-primary-dark transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? "#4CAF50" : "#d6336c",
                  }}
                />
                <div className="relative z-10 flex items-center gap-2">
                  {progress === 100 && stage === "done" ? (
                    <>
                      <CheckCircle size={16} />
                      Done!
                    </>
                  ) : stage === "stained" ? (
                    <>Classify</>
                  ) : (
                    <>
                      {loading ? "Processing..." : "Stain"}
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
                <p className="text-sm text-gray-500 mt-2">
                  {stage === "staining"
                    ? progress < 60
                      ? "Staining in progress..."
                      : "Reconstructing image..."
                    : "Classifying cells..."}
                </p>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {stainedImageUrl && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-2">Stained Image</h4>
            <img
              src={stainedImageUrl}
              alt="Stained Result"
              className="w-full max-h-[60vh] object-contain border rounded-lg"
            />
          </div>
        )}

        {classifiedImageUrl && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-2">Stained & Classified Image</h4>
            <img
              src={classifiedImageUrl}
              alt="Classified Result"
              className="w-full max-h-[60vh] object-contain border rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualStaining;
