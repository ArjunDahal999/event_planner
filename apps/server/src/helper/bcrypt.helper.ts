import bcrypt from "bcryptjs";

export const hashString = async (string: string): Promise<string> => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(string, salt);
};

export const compareHashWithString = async ({
  string,
  hashedString,
}: {
  string: string;
  hashedString: string;
}): Promise<boolean> => {
  console.log("Comparing string with hashed string:", {
    string,
    hashedString,
  });
  return await bcrypt.compare(string, hashedString);
};
