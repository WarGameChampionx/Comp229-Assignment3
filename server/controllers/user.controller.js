import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try
    {
        const users = await User.find().select("-password");
        res.json(users);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try
    {
        const user = await User.findById(req.params.id).select("-password");

        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try
    {
        const { name, email, password } = req.body;

        const user = new User({
            name,
            email,
            password
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    }
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try
    {
        const user = await User.findById(req.params.id);

        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, email, password } = req.body;

        if (name !== undefined)
        {
            user.name = name;
        }

        if (email !== undefined)
        {
            user.email = email;
        }

        if (password !== undefined)
        {
            if (
                typeof password !== "string" ||
                password.length < 12 ||
                Buffer.byteLength(password, "utf8") > 72
            )
            {
                return res.status(400).json({
                    message: "Password must be at least 12 characters and at most 72 UTF-8 bytes."
                });
            }

            user.password = password;
        }

        user.updated = new Date();

        await user.save();

        res.json(user);
    }
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try
    {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAllUsers = async (req, res) => {
    try
    {
        await User.deleteMany({});

        res.json({ message: "All users deleted" });
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};