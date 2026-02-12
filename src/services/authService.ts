import type { User } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  clientId: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

// Decode JWT token (basic implementation)
const decodeJwt = (token: string): GoogleUserInfo | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const authService = {
  // Handle Google OAuth credential response
  async handleGoogleLogin(credentialResponse: GoogleCredentialResponse): Promise<{
    user: User;
    token: string;
  } | null> {
    await delay(300);

    const { credential } = credentialResponse;
    const decoded = decodeJwt(credential);

    if (!decoded) {
      throw new Error('Failed to decode Google credential');
    }

    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.picture,
    };

    // In a real app, you would send the credential to your backend
    // and receive a session token. For now, we use the Google credential directly.
    return {
      user,
      token: credential,
    };
  },

  // Verify token (mock implementation)
  async verifyToken(token: string): Promise<User | null> {
    await delay(200);

    const decoded = decodeJwt(token);
    if (!decoded) return null;

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.picture,
    };
  },

  // Logout
  async logout(): Promise<void> {
    await delay(100);
    // In a real app, you would invalidate the session on the backend
  },

  // Get current user from stored token
  async getCurrentUser(token: string): Promise<User | null> {
    return this.verifyToken(token);
  },
};
