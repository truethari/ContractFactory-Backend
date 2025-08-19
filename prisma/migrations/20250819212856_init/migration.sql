-- CreateEnum
CREATE TYPE "contract-factory"."DeploymentStatus" AS ENUM ('PENDING', 'COMPILED', 'DEPLOYED', 'FAILED');

-- CreateTable
CREATE TABLE "contract-factory"."Account" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract-factory"."Deployment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "address" TEXT,
    "abi" TEXT,
    "deployedTx" TEXT,
    "status" "contract-factory"."DeploymentStatus" NOT NULL DEFAULT 'PENDING',
    "wallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract-factory"."Activity" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_wallet_key" ON "contract-factory"."Account"("wallet");

-- CreateIndex
CREATE INDEX "Account_wallet_idx" ON "contract-factory"."Account"("wallet");

-- CreateIndex
CREATE INDEX "Deployment_wallet_idx" ON "contract-factory"."Deployment"("wallet");

-- CreateIndex
CREATE INDEX "Activity_wallet_idx" ON "contract-factory"."Activity"("wallet");
