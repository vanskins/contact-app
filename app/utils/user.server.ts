import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";

type RegisterForm = {
  username: string;
  password: string;
};

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 12);
  const newUser = await prisma.userAccounts.create({
    data: {
      username: user.username,
      password: passwordHash,
    },
  });
  return {
    id: newUser.id,
    username: user.username,
  };
};
