import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import { Authtelegram } from './auth.telegram'
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "@/services/response.service";

const callback: Callback = (router, context) => {
  router.post(
    "/telegarm",
    validateRequest(
      z.object({
        body: z.object({
          data: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        const data = await Authtelegram(context.prisma, req.body);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          data,
          StatusCode.Ok,
        );

        return serviceResponse;
      } catch (error: any) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Bad request",
          null,
          StatusCode.BadRequest,
        );
      }
    }),
  );
};

export default (context: Context) => createRouter(context, callback);
