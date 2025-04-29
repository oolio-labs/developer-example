import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { config } from "./config/config";

// Import routes
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";

const app = express();
const PORT = config.port;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// API routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../public")));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
