import express from "express";

import {
    signUp,
    signIn
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);

router.get("/me", requireAuth, (req, res) => {
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});

export default router;