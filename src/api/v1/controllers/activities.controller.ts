import { HTTP_STATUS_CODE } from "../../../utils/constants";
import { getAllActivitiesByWallet } from "../services/activities.service";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../../../lib/customHandler";

import type { Response, Request } from "express";

const ActivitiesController = {
  getAllActivities: async (req: Request, res: Response) => {
    try {
      const activities = await getAllActivitiesByWallet(req.user.address);
      return SUCCESS_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.SUCCESS_RESPONSE_CODE,
        activities,
        "Activities retrieved successfully"
      );
    } catch (error) {
      return ERROR_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_RESPONSE_CODE,
        "Error retrieving activities"
      );
    }
  },
};

export default ActivitiesController;
