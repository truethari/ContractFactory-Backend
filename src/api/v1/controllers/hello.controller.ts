import { HTTP_STATUS_CODE } from "../../../utils/constants";
import { SUCCESS_RESPONSE } from "../../../lib/customHandler";

import type { Response, Request } from "express";

const helloController = {
  hello: async (req: Request, res: Response): Promise<Response> => {
    return SUCCESS_RESPONSE(
      res,
      true,
      HTTP_STATUS_CODE.CREATE_RESPONSE_CODE,
      {
        msg: "Hello World",
      },
      "Hello World"
    );
  },
};

export default helloController;
