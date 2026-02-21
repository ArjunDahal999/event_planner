import {
  REFRESH_TOKEN_TABLE,
  TWO_FACTOR_AUTHENTICATION_TABLE,
  USER_ACTIVATION_TABLE,
  USER_TABLE,
} from "../database/constants.ts";
import db from "../database/db.ts";
import {
  type IRefreshToken,
  type ITwoFactorAuthentication,
  type IUser,
  type IUserActivation,
} from "../database/types.ts";

export const authService = () =>
  Object.freeze({
    getUserActivationToken,
    revoke2FASecret,
    create2FASecret,
    createUserActivationToken,
    deleteUserActivationToken,
    verifyUserAccount,
    get2FASecret,
    delete2FASecret,
    getRefreshToken,
    createAccessToken,
    updateAccessToken,
  });

async function getUserActivationToken({
  userId,
}: {
  userId: number;
}): Promise<string | null> {
  try {
    const row = await db<IUserActivation>(USER_ACTIVATION_TABLE)
      .select("activation_token", "expires_at")
      .where({ user_id: userId })
      .first();
    if (row && row.expires_at && new Date(row.expires_at) < new Date()) {
      return null;
    }
    return row?.activation_token ?? null;
  } catch (err) {
    console.error("Error fetching activation token:", err);
    throw err;
  }
}

async function revoke2FASecret({ email }: { email: string }): Promise<void> {
  try {
    await db<ITwoFactorAuthentication>(TWO_FACTOR_AUTHENTICATION_TABLE)
      .where({ email })
      .del();
  } catch (err) {
    console.error("Error revoking 2FA secret:", err);
    throw err;
  }
}

async function create2FASecret({
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

async function createUserActivationToken({
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
      USER_ACTIVATION_TABLE,
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

async function deleteUserActivationToken(userId: number): Promise<void> {
  try {
    await db<IUserActivation>(USER_ACTIVATION_TABLE)
      .where({ user_id: userId })
      .del();
  } catch (err) {
    console.error("Error deleting activation token:", err);
    throw err;
  }
}

async function verifyUserAccount({ userId }: { userId: number }) {
  try {
    await db<IUser>(USER_TABLE)
      .where({ id: userId })
      .update({ is_email_verified: true });
  } catch (error) {
    console.error("Error verifying user account:", error);
    throw error;
  }
}

async function get2FASecret({
  email,
}: {
  email: string;
}): Promise<string | null> {
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

async function delete2FASecret({ email }: { email: string }): Promise<void> {
  try {
    await db<ITwoFactorAuthentication>(TWO_FACTOR_AUTHENTICATION_TABLE)
      .where({ email })
      .del();
  } catch (err) {
    console.error("Error deleting 2FA secret:", err);
    throw err;
  }
}

async function getRefreshToken({
  userId,
}: {
  userId: number;
}): Promise<string | null> {
  try {
    const row = await db<IRefreshToken>(REFRESH_TOKEN_TABLE)
      .select("token")
      .where({ user_id: userId })
      .first();

    return row?.token ?? null;
  } catch (err) {
    console.error("Error fetching refresh token:", err);
    throw err;
  }
}
async function createAccessToken({
  userId,
  refreshToken,
}: {
  userId: number;
  refreshToken: string;
}): Promise<string> {
  try {
    const as = await db<IRefreshToken>(REFRESH_TOKEN_TABLE).insert({
      user_id: userId,
      token: refreshToken,
    });
    return refreshToken;
  } catch (err) {
    console.error("Error generating access token:", err);
    throw err;
  }
}

async function updateAccessToken({
  userId,
  refreshToken,
}: {
  userId: number;
  refreshToken: string;
}): Promise<void> {
  try {
    await db<IRefreshToken>(REFRESH_TOKEN_TABLE)
      .where({ user_id: userId })
      .update({ token: refreshToken });
  } catch (err) {
    console.error("Error updating access token:", err);
    throw err;
  }
}
