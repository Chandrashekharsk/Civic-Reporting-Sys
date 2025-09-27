import express from "express";
import multer from "multer";
import { checkStatusById, createReport, getMyReports, getReportsCount } from "../controllers/report.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage

// Routes
router.post("/", upload.single("image"), createReport);
router.get("/", checkStatusById);
router.get("/getcount/", getReportsCount);
router.get("/my-reports/", getMyReports);

export default router;