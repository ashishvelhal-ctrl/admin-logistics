import { env } from "@/env";

export interface SendOtpData {
  phoneNumber: string;
  hashCode: string;
}

export interface VerifyOtpData {
  phoneNumber: string;
  otpCode: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  data?: any;
}

export class AuthService {
  sendOtp(phoneNumber: string, hashCode: string): void {
    console.log(`Sending OTP to ${phoneNumber} with hashCode: ${hashCode}`);
  }

  verifyOtp(phoneNumber: string, otpCode: string): any {
    console.log(`Verifying OTP ${otpCode} for ${phoneNumber}`);
    return {
      user: { id: 1, phoneNumber },
      tokens: {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      },
    };
  }

  refreshToken(refreshToken: string): any {
    console.log(`Refreshing token: ${refreshToken}`);
    return {
      accessToken: "new-mock-access-token",
      refreshToken: "new-mock-refresh-token",
    };
  }

  logout(userId: number): void {
    console.log(`Logging out user: ${userId}`);
  }

  logoutAll(userId: number): void {
    console.log(`Logging out all devices for user: ${userId}`);
  }

  getMe(userId: number): any {
    console.log(`Fetching user profile for: ${userId}`);
    return {
      id: userId,
      phoneNumber: `+${(env as any).COUNTRY_CODE || "91"}1234567890`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
