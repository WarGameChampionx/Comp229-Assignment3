import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) => {
    return jwt.sign(
        { sub: user._id.toString() },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "1h",
            issuer: "portfolio-api",
            audience: "portfolio-client"
        }
    );
};

// Sign up
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            typeof password !== "string" ||
            password.length < 12 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                message: "Provide a name, valid email, and password of at least 12 characters (maximum 72 UTF-8 bytes)."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        // The User model hashes the password before saving.
        await user.save();

        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        console.error("Sign-up error:", error);
        res.status(500).json({
            message: "Unable to register user."
        });
    }
};

// Sign in
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user || !user.password ||
            !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = createToken(user);

        res.status(200).json({
            message: "Sign-in successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({
            message: "Unable to sign in."
        });
    }
};