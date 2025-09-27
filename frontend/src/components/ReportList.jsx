import React, { useEffect, useState } from "react";

const ReportList = () => {
  const [reports, setReports] = useState([]); // ✅ remove "new"

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    console.log("Fetching reports...");
    try {
      const res = await fetch("http://localhost:4000/api/reports"); // change API URL
      const data = await res.json();
      setReports(data.reports || []); // ✅ update state
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reports</h1>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r._id} className="p-3 bg-gray-100 rounded">
              <h2 className="font-semibold">{r.title || r.category}</h2>
              <p>{r.description}</p>
              <p className="text-sm text-gray-600">
                Priority: {r.priority || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;
