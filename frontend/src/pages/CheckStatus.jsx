import React, { useState } from "react";
import { checkStatusApi } from "../apis";

const CheckStatus = () => {
  const [reportId, setReportId] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const handleCheckStatus = async () => {
    if (!reportId.trim()) {
      setError("⚠️ Please enter a Report ID");
      return;
    }
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await checkStatusApi(reportId);
      if (res) {
        setReport(res);
      } else {
        setError("Report not found!");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch report");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setReport(null);
    setReportId("");
    setError("");
  };

  const formatDate = (dateStr) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reported":
        return "text-yellow-600";
      case "acknowledged":
        return "text-blue-600";
      case "resolved":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 px-4">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          🔍 Check Report Status
        </h2>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Report ID"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            onClick={handleCheckStatus}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transition-all"
            }`}
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-6 font-medium">{error}</p>
        )}

        {report && (
          <div className="relative bg-white shadow-2xl rounded-2xl p-6 border border-gray-200 w-full mx-auto transition-all hover:scale-[1.01]">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-28 h-9 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white rounded-md shadow-md transition-all"
              title="Close"
            >
              Close Report
            </button>

            {/* Report Title */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              {report.title}
            </h3>

            {/* Report Image */}
            {report.imageUrl && (
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            {/* Solution */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
              <p className="font-semibold text-green-700">✅ Solution:</p>
              <p className="text-gray-700">
                {report.solution || "No solution provided yet."}
              </p>
            </div>

            {/* Report Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="mb-1">
                  <span className="font-semibold">Description:</span>{" "}
                  {report.description}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={getStatusColor(report.status)}>
                    {report.status.toUpperCase()}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Assigned Dept:</span>{" "}
                  {report.assignedDept || "Not Assigned"}
                </p>
              </div>

              <div>
                <p className="mb-1">
                  <span className="font-semibold">Citizen Name:</span>{" "}
                  {report.personName}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Mobile No:</span>{" "}
                  {report.mobileNo}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Aadhar No:</span>{" "}
                  {report.aadharNo}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">City:</span> {report.city}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Date of Report:</span>{" "}
                  {formatDate(report.createdAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckStatus;
