import prisma from "../../../lib/prisma";
import { getCurrentTimestamp } from "../../../utils/timestamp";

import type { IActivity, ICreateActivity } from "../../../types/activities.types";

export const getAllActivitiesByWallet = async (wallet: string): Promise<IActivity[]> => {
  const activities = await prisma.activity.findMany({
    where: {
      wallet: {
        equals: wallet,
        mode: "insensitive",
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return activities;
};

export const createActivity = async (data: ICreateActivity): Promise<IActivity> => {
  const activity = await prisma.activity.create({
    data: {
      ...data,
      timestamp: getCurrentTimestamp(),
    },
  });
  return activity;
};
