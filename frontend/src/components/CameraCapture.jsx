"use client";

import React, { useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Cannot access camera. Check permissions.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setCapturedImage(canvas.toDataURL("image/png"));
    }
  };

  const submitImage = () => {
    if (!capturedImage) return alert("Capture an image first!");
    console.log("Submitting image:", capturedImage);
    alert("Image submitted!");
  };

  const buttonStyle = "px-6 py-2 m-2 rounded-md text-white font-semibold transition-all duration-200";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Camera Capture</h2>

      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-[300px] h-[300px] rounded-md border-2 border-gray-400 mb-4 object-cover"
          />
          <div>
            <button
              onClick={startCamera}
              className={`${buttonStyle} bg-blue-500 hover:bg-blue-600`}
            >
              Start Camera
            </button>
            <button
              onClick={captureImage}
              className={`${buttonStyle} bg-green-500 hover:bg-green-600`}
            >
              Capture
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-[300px] h-[300px] rounded-md border-2 border-gray-400 mb-4 object-cover"
          />
          <div>
            <button
              onClick={submitImage}
              className={`${buttonStyle} bg-purple-500 hover:bg-purple-600`}
            >
              Submit
            </button>
            <button
              onClick={() => setCapturedImage(null)}
              className={`${buttonStyle} bg-red-500 hover:bg-red-600`}
            >
              Retake
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
