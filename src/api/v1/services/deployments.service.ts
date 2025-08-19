import prisma from "../../../lib/prisma";

import type { IDeployment } from "../../../types/deployments.types";

export const updateDeploymentTx = async (
  id: string,
  address: string,
  deployedTx: string
): Promise<void> => {
  await prisma.deployment.update({
    where: { id },
    data: {
      address,
      deployedTx,
      status: "DEPLOYED",
    },
  });
};

export const getDeploymentByWalletAndId = async (
  wallet: string,
  id: string
): Promise<IDeployment | null> => {
  return await prisma.deployment.findFirst({
    where: {
      id,
      wallet: {
        equals: wallet,
        mode: "insensitive",
      },
    },
  });
};

export const deleteDeployment = async (id: string): Promise<void> => {
  await prisma.deployment.delete({
    where: { id },
  });
};
