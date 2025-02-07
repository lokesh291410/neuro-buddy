import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export const useFaceDetection = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };

    const startVideo = async () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    };

    loadModels().then(startVideo);
  }, []);

  const detectEmotion = async () => {
    if (!videoRef.current) return;
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    if (detections) {
      const expressions = detections.expressions;
      const highestEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );
      setEmotion(highestEmotion);
    }
  };

  useEffect(() => {
    const interval = setInterval(detectEmotion, 3000); // Detect emotion every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return { videoRef, emotion };
};
