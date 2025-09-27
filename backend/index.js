import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/dbConfig.js";
import reportRouter from "./routes/report.route.js";

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", reportRouter);
// app.use("/api/admin/", adminRouter);

// Example reports route
app.get("/api/health", (req, res) => {
  res.json("SERVER IS HEALTHY");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
