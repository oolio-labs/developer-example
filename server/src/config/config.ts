import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });

// Environment variables config
export const config = {
  port: process.env.PORT || 3000,
  oauth: {
    clientId: process.env.OOLIO_CLIENT_ID || "",
    clientSecret: process.env.OOLIO_CLIENT_SECRET || "",
    redirectUri:
      process.env.OOLIO_REDIRECT_URI || "http://localhost:3000/auth/callback/oolio",
    issuer: new URL("https://auth.oolio.dev"),
  },
  sessionSecret: process.env.SESSION_SECRET || "oolio-developer-example-secret",
};
