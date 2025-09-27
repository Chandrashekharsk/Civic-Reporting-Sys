import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },

    // Citizen info
    personName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    aadharNo: { type: String, required: true },
    city: { type: String },

    // GeoJSON point
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },

    category: { type: String, required: true },

    status: {
      type: String,
      enum: ["reported", "acknowledged", "resolved"],
      default: "reported",
    },
    solution: { type: String, default: "Your report has been forwarded to related department, we will update you soon." },
  },
  { timestamps: true }
);

ReportSchema.index({ location: "2dsphere" });

export default mongoose.model("Report", ReportSchema);
