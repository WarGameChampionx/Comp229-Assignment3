import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization ||
        !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. No valid Bearer token provided."
        });
    }

    const token = authorization.substring(7);

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"],
                issuer: "portfolio-api",
                audience: "portfolio-client"
            }
        );

        const user = await User.findById(decoded.sub);

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists."
            });
        }

        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token."
        });
    }
};

// Require administrator privileges.
export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Administrator privileges required."
        });
    }

    next();
};