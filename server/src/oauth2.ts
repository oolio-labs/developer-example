import * as oauth from "oauth4webapi";
import crypto from "crypto";
interface config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  issuer: URL;
  scope?: string;
  audience?: string;
}

interface storage {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export class OAuth2 {
  private config: config;
  private kv: storage;

  constructor(config: config, kv: storage) {
    this.config = config;
    this.kv = kv;
  }

  async initiateAuth(): Promise<string> {
    const { issuer, clientId, redirectUri } = this.config;
    // Discover OpenID Provider metadata
    const as = await oauth.discoveryRequest(issuer).then((response) => {
      return oauth.processDiscoveryResponse(issuer, response);
    });

    if (!as.authorization_endpoint) {
      throw new Error("Authorization endpoint not found in OIDC discovery");
    }

    if (!as.token_endpoint) {
      throw new Error("Token endpoint not found in OIDC discovery");
    }

    // Create PKCE code verifier and challenge
    const codeVerifier = oauth.generateRandomCodeVerifier();
    const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);
    const codeChallengeMethod = "S256";

    // Generate random state
    const state = crypto.randomBytes(16).toString("hex");

    // Store code_verifier and state in session for later use
    await this.kv.set("code_verifier", codeVerifier);
    await this.kv.set("state", state);

    // Construct the authorization URL with PKCE parameters
    const authorizationUrl = new URL(as.authorization_endpoint);
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("scope", "openid profile email");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set(
      "code_challenge_method",
      codeChallengeMethod,
    );

    return authorizationUrl.toString();
  }

  async handleCallback(url: URL): Promise<any> {
    const state = url.searchParams.get("state") || "";
    const { issuer, clientId, clientSecret, redirectUri } = this.config;

    // Retrieve code_verifier and state from storage
    const storedState = await this.kv.get("state");
    if (state !== storedState) {
      throw new Error("Invalid state parameter");
    }

    const codeVerifier = await this.kv.get("code_verifier");
    if (!codeVerifier) {
      throw new Error("Missing code_verifier");
    }

    // Discover OpenID Provider metadata
    const as = await oauth.discoveryRequest(issuer).then((response) => {
      return oauth.processDiscoveryResponse(issuer, response);
    });

    const client: oauth.Client = { client_id: clientId };
    const clientAuth = oauth.ClientSecretPost(clientSecret);
    const params = oauth.validateAuthResponse(as, client, url, state);

    const tokenResponse = await oauth.authorizationCodeGrantRequest(
      as,
      client,
      clientAuth,
      params,
      redirectUri,
      codeVerifier,
    );

    const tokenSet = await oauth.processAuthorizationCodeResponse(
      as,
      client,
      tokenResponse,
    );

    // Clear PKCE and state from storage
    await this.kv.delete("code_verifier");
    await this.kv.delete("state");

    // Extract and store tokens
    return {
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresIn: tokenSet.expires_in || 3600,
    };
  }

  async userInfo(accessToken: string): Promise<any> {
    const { issuer } = this.config;

    // Discover OpenID Provider metadata
    const as = await oauth.discoveryRequest(issuer).then((response) => {
      return oauth.processDiscoveryResponse(issuer, response);
    });

    if (!as.userinfo_endpoint) {
      throw new Error("Userinfo endpoint not found in OIDC discovery");
    }


    // Create a request to the userinfo endpoint
    const client: oauth.Client = { client_id: this.config.clientId };
    const userInfoResponse = await oauth.userInfoRequest(
      as,
      client,
      accessToken,
    );

    return await userInfoResponse.json();
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const { issuer, clientId, clientSecret } = this.config;

    // Discover OpenID Provider metadata
    const as = await oauth.discoveryRequest(issuer).then((response) => {
      return oauth.processDiscoveryResponse(issuer, response);
    });

    if (!as.token_endpoint) {
      throw new Error("Token endpoint not found in OIDC discovery");
    }

    const client: oauth.Client = { client_id: clientId };
    const clientAuth = oauth.ClientSecretPost(clientSecret);

    // Prepare token refresh request
    const response = await oauth.refreshTokenGrantRequest(
      as,
      client,
      clientAuth,
      refreshToken,
    );

    const tokenSet = await oauth.processRefreshTokenResponse(
      as,
      client,
      response,
    );

    // Extract and store tokens
    return {
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
      expiresIn: tokenSet.expires_in || 3600,
    };
  }
}
