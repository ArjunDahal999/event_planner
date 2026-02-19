import db from "../database/db.ts";
import type { IUser } from "../database/types.ts";

class UserService {
  async createUser(user: {
    name: string;
    email: string;
    password: string;
  }): Promise<number> {
    const [id] = await db("users").insert(user);
    return id;
  }

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await db<IUser>("users").where({ email }).first();
    return user ?? undefined;
  }
}

const userService = new UserService();
export default userService;
