import db from "../database/db.ts";

class UserService {
  async createUser(user: { name: string; email: string; password: string }) {
    return db("users")
      .insert(user)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        throw err;
      });
  }
  async getUserByEmail(
    email: string,
  ): Promise<
    { id: number; name: string; email: string; password: string } | undefined
  > {
    return await db("users")
      .select("id", "name", "email", "password")
      .where({ email })
      .first()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        throw err;
      });
  }
}

const userService = new UserService();
export default userService;
