import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

// Hash passwords before saving.
userSchema.pre("save", async function() {
    if (!this.isModified("password"))
    {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

// Exclude password when serializing user documents.
userSchema.set("toJSON", {
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

export default User;