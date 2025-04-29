import express from "express";
import {
  initiateAuth,
  handleCallback,
  getConnectionStatus,
  disconnect,
} from "../controllers/authController";

const router = express.Router();

// Initiate OAuth authorization
router.post("/connect/oolio", initiateAuth);

// OAuth callback route
router.get("/callback/oolio", handleCallback);

// Get current authentication status
router.get("/status/oolio", getConnectionStatus);

// Disconnect route
router.post("/disconnect/oolio", disconnect);

export default router;
