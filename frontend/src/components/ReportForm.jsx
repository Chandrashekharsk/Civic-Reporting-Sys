import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReportApi } from "../apis";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.enum([
    "pothole",
    "streetlight",
    "trash",
    "damage",
    "road accident",
    "fight",
    "water leakage",
    "sewage overflow",
    "noise complaint",
    "traffic jam",
    "illegal parking",
    "graffiti",
    "public harassment",
    "animal problem",
    "fire hazard",
    "other"
  ]),
  personName: z.string().min(3, "Enter your name"),
  mobileNo: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  aadharNo: z.string().regex(/^\d{12}$/, "Invalid Aadhar number"),
  city: z.string().min(2, "City is required"),
  image: z.any().optional(),
});

export default function ReportForm() {
  const [coords, setCoords] = useState(null);
  const [autoCity, setAutoCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
  });

  // Camera methods
  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied ❌");
      console.error(err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setCapturedImage(blob);
      setValue("image", [new File([blob], "captured-photo.png", { type: "image/png" })]);
      stopCamera();
    });
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Location
  const grabLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("Geolocation not supported");
      navigator.geolocation.getCurrentPosition(
        async (p) => {
          const loc = [p.coords.latitude, p.coords.longitude];
          setCoords(loc);
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${loc[0]}&lon=${loc[1]}&format=json`
            );
            const data = await res.json();
            const cityName =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              "Unknown";
            setAutoCity(cityName);
            setValue("city", cityName);
          } catch (err) {
            console.error("City fetch error:", err);
          }
          resolve(loc);
        },
        (err) => reject(err)
      );
    });

  // Submit
  const onSubmit = async (data) => {
    if (!coords && !data.city) return alert("Please provide city or allow location access");

    let finalCoords = coords;
    if (!coords) {
      try {
        finalCoords = await grabLocation();
      } catch (err) {
        console.log(err);
        return alert("Could not get location");
      }
    }

    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description);
    fd.append("category", data.category);
    fd.append("personName", data.personName);
    fd.append("mobileNo", data.mobileNo);
    fd.append("aadharNo", data.aadharNo);
    fd.append("city", data.city);
    fd.append("lat", finalCoords[0]);
    fd.append("lng", finalCoords[1]);
    if (data.image && data.image.length > 0) fd.append("image", data.image[0]);

    try {
      setLoading(true);
      const res = await createReportApi(fd);
      setSubmittedReport(res);
      reset();
      setCoords(null);
      setAutoCity("");
      setCapturedImage(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.response?.data?.message || "Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  const copyReportId = () => {
    navigator.clipboard.writeText(submittedReport._id || submittedReport.id);
    alert("Copied to clipboard ✅");
  };

  const closeReportView = () => setSubmittedReport(null);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Submitted Report View
  if (submittedReport) {
    return (
      <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md space-y-4">
        <h3 className="text-2xl font-bold text-center text-green-700">✅ Report Submitted!</h3>

        <div className="p-4 bg-green-100 border border-green-300 rounded-lg space-y-2">
          <p className="text-gray-800 font-medium">
            Report ID: <span className="font-bold text-indigo-700">{submittedReport._id || submittedReport.id}</span>
          </p>
          <button
            onClick={copyReportId}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Copy Report ID
          </button>
          <p className="text-sm text-red-600 font-medium text-center">⚠️ Ensure you have copied the Report ID.</p>
        </div>

        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Title:</span> {submittedReport.title}</p>
          <p><span className="font-semibold">Description:</span> {submittedReport.description}</p>
          <p><span className="font-semibold">Category:</span> {submittedReport.category}</p>
          <p><span className="font-semibold">Citizen:</span> {submittedReport.personName}</p>
          <p><span className="font-semibold">Mobile:</span> {submittedReport.mobileNo}</p>
          <p><span className="font-semibold">Aadhar:</span> {submittedReport.aadharNo}</p>
          <p><span className="font-semibold">City:</span> {submittedReport.city}</p>
          <p><span className="font-semibold">Created:</span> {formatDate(submittedReport.createdAt)}</p>
        </div>

        {submittedReport.imageUrl && (
          <div className="mt-4">
            <p className="text-gray-600 font-medium">Attached Image:</p>
            <img src={submittedReport.imageUrl} alt="Report" className="mt-2 rounded-lg border shadow-md w-full object-cover" />
          </div>
        )}

        <button
          onClick={closeReportView}
          className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Close
        </button>
      </div>
    );
  }

  // Form View
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h3 className="text-xl text-center font-semibold text-gray-800">Report an Issue</h3>

      {/* Title */}
      <input
        placeholder="Title"
        {...register("title")}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

      {/* Description */}
      <textarea
        placeholder="Short description"
        rows={3}
        {...register("description")}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

      {/* Name */}
      <input
        placeholder="Your Name"
        {...register("personName")}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      {errors.personName && <p className="text-red-500 text-sm">{errors.personName.message}</p>}

      {/* Mobile */}
      <input
        placeholder="Mobile Number"
        {...register("mobileNo")}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo.message}</p>}

      {/* Aadhar */}
      <input
        placeholder="Aadhar Number"
        {...register("aadharNo")}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      {errors.aadharNo && <p className="text-red-500 text-sm">{errors.aadharNo.message}</p>}

      {/* Category */}
      <select
        {...register("category")}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        <option value="pothole">Pothole</option>
        <option value="streetlight">Streetlight</option>
        <option value="trash">Trash</option>
        <option value="damage">Damage</option>
        <option value="road accident">Road Accident</option>
        <option value="fight">Fight</option>
        <option value="water leakage">Water Leakage</option>
        <option value="sewage overflow">Sewage Overflow</option>
        <option value="noise complaint">Noise Complaint</option>
        <option value="traffic jam">Traffic Jam</option>
        <option value="illegal parking">Illegal Parking</option>
        <option value="graffiti">Graffiti</option>
        <option value="public harassment">Public Harassment</option>
        <option value="animal problem">Animal Problem</option>
        <option value="fire hazard">Fire Hazard</option>
        <option value="other">Other</option>

      </select>

      {/* City + Grab Location */}
      <div className="flex items-center space-x-2">
        <input
          placeholder="City"
          {...register("city")}
          defaultValue={autoCity}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={grabLocation}
          className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Get my location
        </button>
      </div>
      {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}

      {/* File Upload + Camera */}
      <div className="flex items-center justify-between gap-3">
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="flex-1 text-sm text-gray-600 border rounded-lg file:bg-indigo-600 file:text-white file:px-4 file:py-2 hover:file:bg-indigo-700"
        />
        {!showCamera && (
          <button
            type="button"
            onClick={startCamera}
            className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
          >
            Open Camera
          </button>
        )}
      </div>

      {/* Camera Preview */}
      {showCamera && (
        <div className="mt-4 space-y-3">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="mt-4 space-y-3">
          <p className="text-gray-600">Captured Image:</p>
          <img src={URL.createObjectURL(capturedImage)} alt="Captured" className="rounded-lg border" />
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => { setCapturedImage(null); startCamera(); }}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
