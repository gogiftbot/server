import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import { GiftWithdraw } from './gift.withdraw'
import { GiftSell } from './gift.sell'
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "@/services/response.service";

const callback: Callback = (router, context) => {
  router.post(
    "/sell",
    validateRequest(
      z.object({
        body: z.object({
          accountGiftId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        const data = await GiftSell(context.prisma, req.account, req.body);

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

  router.post(
    "/withdraw",
    validateRequest(
      z.object({
        body: z.object({
          accountGiftId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        const data = await GiftWithdraw(context.prisma, req.account, req.body);

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
