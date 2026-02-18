import bcrypt from "bcryptjs";

export const hashPassword = (password: string): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const isPasswordCorrect = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
