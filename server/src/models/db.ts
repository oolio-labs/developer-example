// Simple in-memory database for token storage

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp when the token expires
  userId: string;
}

class InMemoryDB {
  private token: TokenData | null = null;

  // Store token for a account
  async setOolioTokens(tokenData: TokenData): Promise<void> {
    this.token = tokenData;
  }

  // Get tokens for a account
  async getOolioTokens(): Promise<TokenData | null> {
    return this.token;
  }

  // Clear all data
  async clearOolioTokens(): Promise<void> {
    this.token = null;
  }
}

// Export a singleton instance
export const db = new InMemoryDB();
