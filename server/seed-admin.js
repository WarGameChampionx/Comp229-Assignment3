import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/user.model.js";
import connectDB from "./config/db.js";

dotenv.config();

async function seedAdmin() {
    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Missing administrator environment variables.");
        }

        if (
            ADMIN_PASSWORD.length < 12 ||
            Buffer.byteLength(ADMIN_PASSWORD, "utf8") > 72
        ) {
            throw new Error(
                "Administrator password must be at least 12 characters and at most 72 UTF-8 bytes."
            );
        }

        await connectDB();

        const email = ADMIN_EMAIL.trim().toLowerCase();

        let admin = await User.findOne({ email }).select("+password");

        if (admin) {
            // Update the configured administrator account.
            admin.name = ADMIN_NAME.trim();
            admin.role = "admin";

            // The existing model hook hashes updated passwords.
            if (!(await bcrypt.compare(ADMIN_PASSWORD, admin.password))) {
                admin.password = ADMIN_PASSWORD;
            }

            await admin.save();

            console.log("Administrator account updated.");
        } else {
            admin = new User({
                name: ADMIN_NAME.trim(),
                email,
                password: ADMIN_PASSWORD,
                role: "admin"
            });

            await admin.save();

            console.log("Administrator account created.");
        }
    }
    catch (error) {
        console.error("Administrator seed failed:", error.message);
        process.exitCode = 1;
    }
    finally {
        await mongoose.disconnect();
    }
}

seedAdmin();