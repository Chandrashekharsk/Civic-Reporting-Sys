import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDashboardReports } from "../apis";

// Validation: either Aadhaar (12 digits) OR Mobile (10 digits starting 6-9)
const searchSchema = z.object({
  identifier: z
    .string()
    .min(10, "Enter a valid Aadhaar or Mobile")
    .refine(
      (val) =>
        /^\d{12}$/.test(val) || /^[6-9]\d{9}$/.test(val),
      "Enter a valid 12-digit Aadhaar or 10-digit Mobile number"
    ),
});

const UserDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setReports([]);

      const identifier = data.identifier.trim();
      const payload = {};
      if (/^\d{12}$/.test(identifier)) payload.aadharNo = identifier;
      else payload.mobile = identifier;

      const result = await getDashboardReports(payload);
      setReports(result || []);
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">User Dashboard</h1>

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter Aadhaar or Mobile Number"
          {...register("identifier")}
          className="flex-1 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>
      {errors.identifier && <p className="text-red-500 mb-4">{errors.identifier.message}</p>}

      {/* Results */}
      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p className="text-gray-500">No reports found.</p>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="grid gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="border rounded-xl shadow-md bg-white p-4 flex flex-col md:flex-row gap-4"
            >
              {/* Image */}
              {report.imageUrl && (
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full md:w-60 h-40 object-cover rounded-xl"
                />
              )}

              {/* Details */}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-semibold">{report.title}</h2>
                <p className="text-gray-700">{report.description}</p>

                <div className="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                  <p><strong>Report Id:</strong> {report._id}</p>
                  <p><strong>Person:</strong> {report.personName}</p>
                  <p><strong>City:</strong> {report.city}</p>
                  <p><strong>Aadhaar:</strong> {report.aadharNo}</p>
                  <p><strong>Mobile:</strong> {report.mobileNo}</p>
                  <p><strong>Category:</strong> {report.category}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                  <p className="col-span-2"><strong>Solution:</strong> {report.solution || "Pending"}</p>
                </div>

                <p className="text-xs text-gray-500">
                  Created: {new Date(report.createdAt).toLocaleString()}
                  {/* Created: {new Date(report.createdAt).toLocaleString()} | Updated:{" "}
                  {new Date(report.updatedAt).toLocaleString()} */}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
