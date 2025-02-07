import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    location: "",
    email: "",
    consent: false,
    emotion: "Normal",
  });

  const [detecting, setDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
        setCameraError("Failed to load emotion detection models.");
      } finally {
        setLoading(false);
      }
    };

    loadModels();
    return () => stopEmotionDetection();
  }, []);

  const startEmotionDetection = async () => {
    if (!detecting && modelsLoaded) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              resolve();
            };
          });

          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }

          setShowCamera(true);
          setDetecting(true);
          startDetectionLoop();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError(
          "Could not access camera. Please ensure you have granted camera permissions."
        );
      }
    }
  };

  const startDetectionLoop = () => {
    intervalRef.current = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        try {
          const detections = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
            )
            .withFaceExpressions();

          if (detections && detections.length > 0) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );

            const resizedDetections = faceapi.resizeResults(detections, {
              width: 320,
              height: 240,
            });

            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

            const emotions = detections[0].expressions;
            const dominantEmotion = Object.entries(emotions).reduce((a, b) =>
              a[1] > b[1] ? a : b
            )[0];

            const { box } = resizedDetections[0].detection;
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(box.x, box.y - 20, 100, 20);
            ctx.font = "16px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(
              `${dominantEmotion}: ${(emotions[dominantEmotion] * 100).toFixed(
                0
              )}%`,
              box.x,
              box.y - 5
            );

            setFormData((prev) => ({
              ...prev,
              emotion: dominantEmotion,
            }));
          }
        } catch (error) {
          console.error("Error in detection loop:", error);
        }
      }
    }, 100);
  };

  const stopEmotionDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setShowCamera(false);
    setDetecting(false);
    setCameraError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    stopEmotionDetection();
    console.log("Form Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          NeuroBuddy Session Form
        </h1>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-blue-600 font-medium">
              Loading models...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form fields with improved styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Full Name", type: "text", icon: "👤" },
                { name: "age", label: "Age", type: "number", icon: "📅" },
                { name: "sex", label: "Sex", type: "text", icon: "⚤" },
                {
                  name: "location",
                  label: "Location",
                  type: "text",
                  icon: "📍",
                },
                { name: "email", label: "Email", type: "email", icon: "✉️" },
              ].map((field) => (
                <div key={field.name} className="relative">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    {field.icon} {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Emotion display with improved styling */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    🎭 Emotion Detection
                  </h3>
                  <p className="text-blue-600 mt-1">
                    Enable your camera to detect your current emotion
                  </p>
                </div>
                <button
                  type="button"
                  onClick={
                    detecting ? stopEmotionDetection : startEmotionDetection
                  }
                  className={`px-6 py-3 rounded-lg text-white font-medium ${
                    detecting
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition-all transform hover:scale-105 disabled:opacity-50`}
                  disabled={!modelsLoaded}
                >
                  {detecting ? "Stop Detection" : "Start Detection"}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Camera display with improved styling */}
                {showCamera && (
                  <div className="relative w-full md:w-1/2 aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                )}

                {/* Emotion result display */}
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Detected Emotion
                  </label>
                  <input
                    name="emotion"
                    value={formData.emotion}
                    readOnly
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-lg font-medium text-blue-900"
                  />
                </div>
              </div>

              {/* Error message with improved styling */}
              {cameraError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  ⚠️ {cameraError}
                </div>
              )}
            </div>

            {/* Consent checkbox with improved styling */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
                className="w-5 h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
              />
              <label htmlFor="consent" className="text-gray-700">
                I agree to AI data collection & code of conduct
              </label>
            </div>

            {/* Submit button with improved styling */}
            <button
              type="submit"
              disabled={!formData.consent}
              className={`w-full py-4 px-6 rounded-xl text-white text-lg font-semibold transition-all transform hover:scale-105 ${
                formData.consent
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormPage;
