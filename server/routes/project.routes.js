import express from "express";
import {
    requireAuth,
    requireAdmin
} from "../middleware/auth.middleware.js";

import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js";

const router = express.Router();

// Public read access
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Administrator-only modifications
router.post("/", requireAuth, requireAdmin, createProject);
router.put("/:id", requireAuth, requireAdmin, updateProject);
router.delete("/:id", requireAuth, requireAdmin, deleteProject);

export default router;