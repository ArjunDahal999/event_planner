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
  async getUserByEmail(
    email: string,
  ): Promise<
    | {
        id: number;
        name: string;
        email: string;
        password: string;
        is_email_verified: boolean;
      }
    | undefined
  > {
    const user = await db<IUser>("users").where({ email }).first();
    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          is_email_verified: user.is_email_verified,
        }
      : undefined;
  }
}

const userService = new UserService();
export default userService;
