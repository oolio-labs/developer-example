import { Request, Response } from "express";
import { config } from "../config/config";
import { db, TokenData } from "../models/db";
import { OAuth2 } from "../oauth2";

class SessionStorage {
  private session: any;

  constructor(session: any) {
    this.session = session;
  }

  async get(key: string): Promise<any> {
    return this.session[key];
  }

  async set(key: string, value: any): Promise<void> {
    this.session[key] = value;
  }

  async delete(key: string): Promise<void> {
    delete this.session[key];
  }
}

// Initiate OAuth2 authorization flow
export const initiateAuth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const oauth = new OAuth2(config.oauth, new SessionStorage(req.session));
    // Redirect to authorization server
    res.redirect(await oauth.initiateAuth());
  } catch (error) {
    console.error("Error initiating OAuth flow:", error);
    res.status(500).json({ error: "Failed to initiate authentication" });
  }
};

// Handle OAuth2 callback
export const handleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const url = new URL(req.url, config.oauth.redirectUri);
    const oauth = new OAuth2(config.oauth, new SessionStorage(req.session));
    const token = await oauth.handleCallback(url);
    const userInfo = await oauth.userInfo(token.accessToken);
    const userId = userInfo.sub as string;

    // Store tokens in our database
    const tokenData: TokenData = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: Date.now() + token.expiresIn * 1000,
      userId,
    };

    await db.setOolioTokens(tokenData);

    // Redirect to frontend with success message
    res.redirect("/?status=success");
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    res.redirect("/?status=error");
  }
};

// Refresh an access token using a refresh token
export const refreshAccessToken = async (): Promise<TokenData | null> => {
  try {
    const oauth = new OAuth2(config.oauth, new SessionStorage({}));
    let tokenData = await db.getOolioTokens();
    if (!tokenData) {
      console.error("User not found or no tokens available");
      return null;
    }

    const res = await oauth.refreshToken(tokenData?.refreshToken!);

    // Store updated tokens
    await db.setOolioTokens({
      ...tokenData,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresAt: Date.now() + res.expiresIn * 1000,
    });
    return tokenData;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

// Get the current connection status with Oolio
export const getConnectionStatus = async (_: Request, res: Response) => {
  const tokenData = await db.getOolioTokens();
  if (!tokenData) {
    res.json({ authenticated: false });
    return;
  }

  const isTokenValid = tokenData.expiresAt > Date.now();
  res.json({
    authenticated: true,
    isTokenValid,
  });
};

// Disconnect - clear session and tokens
export const disconnect = async (_: Request, res: Response) => {
  await db.clearOolioTokens();
  res.json({
    message: "Disconnected successfully",
  });
};
