import { Request, Response } from "express";
import { db } from "../models/db";
import { refreshAccessToken } from "./authController";

// Get user data from Oolio API
export const getUserData = async (_: Request, res: Response,): Promise<void> => {
  try {

    // Get user tokens
    let tokens = await db.getOolioTokens();
    if (!tokens) {
      res.status(401).json({ error: "No access token found" });
      return;
    }

    // Check if token is expired and refresh if needed
    if (tokens.expiresAt <= Date.now()) {
      const newTokens = await refreshAccessToken();
      if (!newTokens) {
        res.status(401).json({ error: "Failed to refresh token" });
        return;
      }
      tokens = newTokens;
    }

    // Example call to Oolio API
    // Replace with the actual Oolio API endpoint
    const apiResponse = await fetch("https://sso.oolio.dev/api/v1/users/" + tokens.userId, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};
