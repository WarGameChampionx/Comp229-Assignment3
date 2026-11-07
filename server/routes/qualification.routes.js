import express from "express";
import {
    requireAuth,
    requireAdmin
} from "../middleware/auth.middleware.js";

import {
    getQualifications,
    getQualificationById,
    createQualification,
    updateQualification,
    deleteQualification
} from "../controllers/qualification.controller.js";

const router = express.Router();

// Public read access
router.get("/", getQualifications);
router.get("/:id", getQualificationById);

// Administrator-only modifications
router.post("/", requireAuth, requireAdmin, createQualification);
router.put("/:id", requireAuth, requireAdmin, updateQualification);
router.delete("/:id", requireAuth, requireAdmin, deleteQualification);

export default router;