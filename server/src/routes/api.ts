import express from "express";
import { getUserData, getOrganisationLocations } from "../controllers/apiController";

const router = express.Router();

// Get user data from Oolio API
router.get("/user", getUserData);

router.get("/locations", getOrganisationLocations);

export default router;
