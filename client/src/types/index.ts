export interface User {
  id: string;
  profile: {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
    [key: string]: any;
  };
}

export interface AuthStatus {
  authenticated: boolean;
  isTokenValid?: boolean;
  user?: User;
}

export interface ApiError {
  error: string;
  message?: string;
}
