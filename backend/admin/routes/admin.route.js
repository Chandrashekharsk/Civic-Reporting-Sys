import express from "express";
import { updateTicketStatus } from "../controllers/admin.controller.js";


const router = express.Router();
router.put("/:id", updateTicketStatus);

export default router;