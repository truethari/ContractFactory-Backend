import prisma from "../../../lib/prisma";

export const isUserExists = async (wallet: string): Promise<boolean> => {
  const user = await prisma.account.findFirst({
    where: { wallet: { equals: wallet, mode: "insensitive" } },
  });
  return user !== null;
};

export const createUserIfNotExists = async (wallet: string): Promise<void> => {
  const userExists = await isUserExists(wallet);
  if (!userExists) {
    await prisma.account.create({
      data: { wallet },
    });
  }
};
