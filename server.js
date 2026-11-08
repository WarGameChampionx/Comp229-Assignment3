import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, ".env"),
    override: true
});

import app from "./server/express.js";
import router from "./server/assets-router.js";
import connectDB from "./server/config/db.js";
import contactRoutes from "./server/routes/contact.routes.js";
import qualificationRoutes from "./server/routes/qualification.routes.js";
import projectRoutes from "./server/routes/project.routes.js";
import userRoutes from "./server/routes/user.routes.js";
import authRoutes from "./server/routes/auth.routes.js";

connectDB();

app.use("/src", router);

app.use("/api/contacts", contactRoutes);
app.use("/api/qualifications", qualificationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/", function (req, res) {
    res.json({
        message: "Welcome to My Portfolio application."
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

export default app;