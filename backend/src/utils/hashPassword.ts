import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const bcryptHash = await bcrypt.hash(password, 12);
  return bcryptHash;
}