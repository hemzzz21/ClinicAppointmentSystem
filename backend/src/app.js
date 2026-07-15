import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { swaggerUi, specs } from "./docs/swagger.js";
import uploadRoutes from "./routes/upload.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Serving uploads from:", path.join(__dirname, "../uploads"));

// ==============================
// Middlewares
// ==============================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);


// ==============================
// Health Check Route
// ==============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Clinic Appointment API is running 🚀",
  });
});

// ==============================
// API Routes
// ==============================
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/doctors", doctorRoutes);

app.use("/api/v1/appointments", appointmentRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/uploads", uploadRoutes);

app.use("/api/v1/notifications", notificationRoutes);
// ==============================
// Error Middleware
// ==============================
app.use(errorMiddleware);

export default app;