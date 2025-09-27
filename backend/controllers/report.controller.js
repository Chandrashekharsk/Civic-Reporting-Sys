import Report from "../models/report.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// Create report
export const createReport = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    const report = await Report.create({
      ...req.body,
      imageUrl,
      location: {
        type: "Point",
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get reports id
export const checkStatusById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Report ID is required" });

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    return res.status(200).json({
      id: report._id,
      title: report.title,
      description: report.description,
      status: report.status,
      assignedDept: report.assignedDept || "Not Assigned",
      personName: report.personName,
      mobileNo: report.mobileNo,
      aadharNo: report.aadharNo,
      city: report.city,
      imageUrl: report.imageUrl,
      solution: report.solution,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    });
  } catch (error) {
    console.error("Error checking report status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all reports or by filter
export const getReports = async (req, res) => {
  try {
    const { reportId, city, lat, lng, radius = 2000 } = req.query;
    let filter = {};

    if (reportId) {
      const report = await Report.findById(reportId);
      if (!report) return res.status(404).json({ message: "Report not found" });
      return res.json(report);
    }

    if (city) filter.city = city;

    if (lat && lng) {
      filter.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius / 6378137],
        },
      };
    }

    const reports = await Report.find(filter);
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reports by Aadhaar or Mobile
export const getMyReports = async (req, res) => {
  try {
    const { aadharNo, mobileNo } = req.query;
    if (!aadharNo && !mobileNo) {
      return res.status(400).json({ message: "Aadhaar number or Mobile number is required" });
    }

    const query = {};
    if (aadharNo) query.aadharNo = aadharNo;
    if (mobileNo) query.mobileNo = mobileNo;

    const reports = await Report.find(query);
    if (!reports.length) return res.status(404).json({ message: "No reports found" });

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ New function: Get total count of all reports
export const getReportsCount = async (req, res) => {
  try {
    const count = await Report.countDocuments();
    res.status(200).json({ totalReports: count });
  } catch (error) {
    console.error("Error fetching report count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
