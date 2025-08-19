import type { DeploymentStatus } from "../../generated/prisma";

export interface IDeployment {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  address?: string | null;
  abi?: string | null;
  deployedTx?: string | null;
  status: DeploymentStatus;
  wallet: string;
  createdAt: Date;
  updatedAt: Date;
}
