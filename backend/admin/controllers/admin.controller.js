import Report from "../models/report.model.js";

// Update solution/summary of a report
export const updateReportSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;

    if (!solution) return res.status(400).json({ message: "Solution is required" });

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.solution = solution;
    await report.save();

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error updating solution:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
