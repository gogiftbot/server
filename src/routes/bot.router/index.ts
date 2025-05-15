import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "services/response.service";
import { emitter } from "services/event.service";

const callback: Callback = (router, context) => {
  router.post(
    "/deposit",
    validateRequest(
      z.object({
        body: z.object({
          transactionId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        emitter.onDeposit(req.body.transactionId);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          null,
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

  router.post(
    "/withdraw",
    validateRequest(
      z.object({
        body: z.object({
          transactionId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        emitter.onWithdraw(req.body.transactionId);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          null,
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
