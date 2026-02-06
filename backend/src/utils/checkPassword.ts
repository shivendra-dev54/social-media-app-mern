import bcrypt from "bcryptjs"

export const checkPassword = async (password: string, hash: string) => {
  const isCorrect: boolean = await bcrypt.compare(password, hash);
  return isCorrect;
}