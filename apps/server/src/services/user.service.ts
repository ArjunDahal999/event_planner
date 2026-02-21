import db from "../database/db.ts";
import type { IUser } from "../database/types.ts";

export const userService = () => {
  return Object.freeze({
    createUser,
    getUserByEmail,
  });
};

async function createUser(user: {
  name: string;
  email: string;
  password: string;
}): Promise<number> {
  const [id] = await db("users").insert(user);
  return id;
}

async function getUserByEmail(email: string): Promise<IUser | undefined> {
  const user = await db<IUser>("users").where({ email }).first();
  return user ?? undefined;
}
