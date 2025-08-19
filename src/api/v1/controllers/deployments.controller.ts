import fs from "fs";
import path from "path";
import solc from "solc";
import prisma from "../../../lib/prisma";
import { HTTP_STATUS_CODE } from "../../../utils/constants";
import { createActivity } from "../services/activities.service";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../../../lib/customHandler";
import {
  deleteDeployment,
  updateDeploymentTx,
  getDeploymentByWalletAndId,
} from "../services/deployments.service";

import type { Response, Request } from "express";
import { DeploymentStatus } from "../../../../generated/prisma";

// OpenZeppelin contract resolver (from compile route)
function findImports(importPath: string): {
  contents?: string;
  error?: string;
} {
  try {
    // Handle OpenZeppelin imports
    if (importPath.startsWith("@openzeppelin/contracts/")) {
      const contractPath = path.join(process.cwd(), "node_modules", importPath);

      if (fs.existsSync(contractPath)) {
        const contents = fs.readFileSync(contractPath, "utf8");
        return { contents };
      }
    }

    return { error: `File not found: ${importPath}` };
  } catch (error) {
    console.error(`Error reading ${importPath}:`, error);
    return { error: `Error reading ${importPath}:` };
  }
}

const DeploymentsController = {
  /**
   * GET /api/v1/deployments
   * Get all deployments for a user
   */
  allDetails: async (req: Request, res: Response) => {
    try {
      const deployments = await prisma.deployment.findMany({
        where: {
          wallet: {
            equals: req.user.address,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return SUCCESS_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.SUCCESS_RESPONSE_CODE,
        deployments,
        "Successfully fetched all deployment details"
      );
    } catch (error) {
      console.error(error);
      return ERROR_RESPONSE(
        res,
        false,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_RESPONSE_CODE,
        "An error occurred while fetching all deployment details"
      );
    }
  },

  /**
   * POST /api/v1/deployments/compile
   * Compile Solidity code and create deployment
   */
  compile: async (req: Request, res: Response) => {
    try {
      const { name, category, description, sourceCode } = req.body;

      // Validation
      if (!name || !category || !sourceCode) {
        return ERROR_RESPONSE(
          res,
          false,
          HTTP_STATUS_CODE.BAD_REQUEST_RESPONSE_CODE,
          "Missing required fields: name, category, sourceCode"
        );
      }

      // Perform Solidity compilation
      const input = {
        language: "Solidity",
        sources: {
          [`${name}.sol`]: {
            content: sourceCode,
          },
        },
        settings: {
          outputSelection: {
            "*": {
              "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object"],
            },
          },
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      };

      const compilationResult = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports })
      );

      const errors: string[] = [];
      const warnings: string[] = [];

      if (compilationResult.errors) {
        for (const error of compilationResult.errors) {
          if (error.severity === "error") {
            errors.push((error.formattedMessage as string) || (error.message as string));
          } else if (error.severity === "warning") {
            warnings.push((error.formattedMessage as string) || (error.message as string));
          }
        }
      }

      let deployment;
      let abi = null;

      await createActivity({
        description: `Compiled ${name}.sol`,
        wallet: req.user.address,
      });

      if (errors.length > 0) {
        // Compilation failed
        deployment = await prisma.deployment.create({
          data: {
            name,
            category,
            description,
            status: DeploymentStatus.FAILED,
            wallet: req.user.address,
          },
        });

        return SUCCESS_RESPONSE(
          res,
          true,
          HTTP_STATUS_CODE.SUCCESS_RESPONSE_CODE,
          {
            deployment,
            compilationResult: {
              success: false,
              errors,
              warnings,
            },
          },
          "Compilation completed with errors"
        );
      }

      // Find the first contract in the compilation output
      const sourceFile = compilationResult.contracts[`${name}.sol`];
      if (!sourceFile) {
        deployment = await prisma.deployment.create({
          data: {
            name,
            category,
            description,
            status: DeploymentStatus.FAILED,
            wallet: req.user.address,
          },
        });

        return ERROR_RESPONSE(
          res,
          false,
          HTTP_STATUS_CODE.BAD_REQUEST_RESPONSE_CODE,
          `No contracts found in compilation output for ${name}.sol`
        );
      }

      // Get the first contract from the source file
      const contractNames = Object.keys(sourceFile);
      if (contractNames.length === 0) {
        deployment = await prisma.deployment.create({
          data: {
            name,
            category,
            description,
            status: DeploymentStatus.FAILED,
            wallet: req.user.address,
          },
        });

        return ERROR_RESPONSE(
          res,
          false,
          HTTP_STATUS_CODE.BAD_REQUEST_RESPONSE_CODE,
          `No contracts found in ${name}.sol`
        );
      }

      const contractOutput = sourceFile[contractNames[0]];

      // Compilation successful
      abi = JSON.stringify(contractOutput.abi);

      deployment = await prisma.deployment.create({
        data: {
          name,
          category,
          description,
          status: DeploymentStatus.COMPILED,
          abi,
          wallet: req.user.address,
        },
      });

      return SUCCESS_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.CREATE_RESPONSE_CODE,
        {
          deployment,
          compilationResult: {
            success: true,
            bytecode: contractOutput.evm.bytecode.object,
            abi: contractOutput.abi,
            warnings,
          },
        },
        "Contract compiled and deployment created successfully"
      );
    } catch (error) {
      console.error(error);
      return ERROR_RESPONSE(
        res,
        false,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_RESPONSE_CODE,
        "An error occurred while compiling and creating deployment"
      );
    }
  },

  /**
   * POST /api/v1/deployments/:id/deploy
   * Deploy a compiled contract
   */
  deploy: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { deployedTx, address } = req.body;

      const deployment = await getDeploymentByWalletAndId(req.user.address, id);

      if (!deployment) {
        return ERROR_RESPONSE(
          res,
          false,
          HTTP_STATUS_CODE.NOT_FOUND_RESPONSE_CODE,
          "Deployment not found"
        );
      }

      await updateDeploymentTx(id, address, deployedTx);
      await createActivity({
        description: `Deployed ${deployment.name}.sol`,
        wallet: req.user.address,
      });

      return SUCCESS_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.SUCCESS_RESPONSE_CODE,
        {},
        "Contract deployed successfully"
      );
    } catch (error) {
      console.error(error);
      return ERROR_RESPONSE(
        res,
        false,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_RESPONSE_CODE,
        "An error occurred while deploying the contract"
      );
    }
  },

  /**
   * DELETE /api/v1/deployments/:id
   * Delete a deployment
   */
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deployment = await getDeploymentByWalletAndId(req.user.address, id);

      if (!deployment) {
        return ERROR_RESPONSE(
          res,
          false,
          HTTP_STATUS_CODE.NOT_FOUND_RESPONSE_CODE,
          "Deployment not found"
        );
      }

      await deleteDeployment(id);
      await createActivity({
        description: `Deleted ${deployment.name}.sol`,
        wallet: req.user.address,
      });

      return SUCCESS_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.SUCCESS_RESPONSE_CODE,
        {},
        "Deployment deleted successfully"
      );
    } catch (error) {
      console.error(error);
      return ERROR_RESPONSE(
        res,
        false,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_RESPONSE_CODE,
        "An error occurred while deleting the deployment"
      );
    }
  },
};

export default DeploymentsController;
