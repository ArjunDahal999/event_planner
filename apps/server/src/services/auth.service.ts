import {
  TWO_FACTOR_AUTHENTICATION_TABLE,
  USER_TABLE,
} from "../database/constants.ts";
import db from "../database/db.ts";
import type {
  ITwoFactorAuthentication,
  IUser,
  IUserActivation,
} from "../database/types.ts";

const userActivationTable = "user_activation";

class AuthService {
  async getUserActivationToken({
    userId,
  }: {
    userId: number;
  }): Promise<string | null> {
    try {
      const row = await db<IUserActivation>(userActivationTable)
        .select("activation_token")
        .where({ user_id: userId })
        .first();

      return row?.activation_token ?? null;
    } catch (err) {
      console.error("Error fetching activation token:", err);
      throw err;
    }
  }
  async create2FASecret({
    userId,
    email,
    secret,
  }: {
    userId: number;
    email: string;
    secret: string;
  }): Promise<number> {
    try {
      const [created2FAid] = await db<ITwoFactorAuthentication>(
        TWO_FACTOR_AUTHENTICATION_TABLE,
      ).insert({
        user_id: userId,
        email,
        secret,
      });
      return created2FAid;
    } catch (err) {
      console.error("Error creating 2FA secret:", err);
      throw err;
    }
  }
  async createUserActivationToken({
    userId,
    token,
    expiresAt,
  }: {
    userId: number;
    token: string;
    expiresAt: Date;
  }): Promise<number> {
    try {
      const [createdTokenID] = await db<IUserActivation>(
        userActivationTable,
      ).insert({
        user_id: userId,
        activation_token: token,
        expires_at: expiresAt,
      });
      return createdTokenID;
    } catch (err) {
      console.error("Error creating activation token:", err);
      throw err;
    }
  }

  async deleteUserActivationToken(userId: number): Promise<void> {
    try {
      await db<IUserActivation>(userActivationTable)
        .where({ user_id: userId })
        .del();
    } catch (err) {
      console.error("Error deleting activation token:", err);
      throw err;
    }
  }

  async verifyUserAccount({ userId }: { userId: number }) {
    try {
      await db<IUser>(USER_TABLE)
        .where({ id: userId })
        .update({ is_email_verified: true });
    } catch (error) {
      console.error("Error verifying user account:", error);
      throw error;
    }
  }

  async get2FASecret({ email }: { email: string }): Promise<string | null> {
    try {
      const row = await db<ITwoFactorAuthentication>(
        TWO_FACTOR_AUTHENTICATION_TABLE,
      )
        .select("secret")
        .where({ email })
        .first();

      return row?.secret ?? null;
    } catch (err) {
      console.error("Error fetching 2FA secret:", err);
      throw err;
    }
  }

  async delete2FASecret({ email }: { email: string }): Promise<void> {
    try {
      await db<ITwoFactorAuthentication>(TWO_FACTOR_AUTHENTICATION_TABLE)
        .where({ email })
        .del();
    } catch (err) {
      console.error("Error deleting 2FA secret:", err);
      throw err;
    }
  }
}

const authService = new AuthService();
export default authService;
