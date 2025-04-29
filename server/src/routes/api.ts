import express from "express";
import { getUserData } from "../controllers/apiController";

const router = express.Router();

// Get user data from Oolio API
router.get("/user", getUserData);

export default router;
