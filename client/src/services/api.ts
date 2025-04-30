import { AuthStatus } from "../types";

const API_URL = "http://localhost:3000";

// Get authentication status
export const getAuthStatus = async (): Promise<AuthStatus> => {
  try {
    const response = await fetch(`${API_URL}/auth/status/oolio`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting auth status:", error);
    return { authenticated: false };
  }
};

// Initiate OAuth flow
export const initiateOAuth = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/auth/connect/oolio`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate auth: ${response.status}`);
    }

    const data = await response.json();
    return data.authUrl;
  } catch (error) {
    console.error("Error initiating OAuth:", error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/disconnect/oolio`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to logout: ${response.status}`);
    }
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Get user data from Oolio API
export const getUserData = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/user`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to get user data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

// Get organization locations from Oolio API
export const getLocations = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/locations`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to get locations: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting locations:", error);
    throw error;
  }
};
