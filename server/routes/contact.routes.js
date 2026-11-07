import express from "express";
import {
    requireAuth,
    requireAdmin
} from "../middleware/auth.middleware.js";

import {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} from "../controllers/contact.controller.js";

const router = express.Router();

// Administrator-only access to submissions
router.get("/", requireAuth, requireAdmin, getContacts);
router.get("/:id", requireAuth, requireAdmin, getContactById);

// Public contact form submission
router.post("/", createContact);

// Administrator-only modifications
router.put("/:id", requireAuth, requireAdmin, updateContact);
router.delete("/:id", requireAuth, requireAdmin, deleteContact);

export default router;