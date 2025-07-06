import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import { AccountGet } from './account.get'
import { AccountPromo } from './account.promo'
import { AccountUpdate } from './account.update'
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "@/services/response.service";

const callback: Callback = (router, context) => {
  router.get(
    "/",
    validateRequest(
      z.object({}),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        const account = await AccountGet(context.prisma, req.account);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          account,
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
    "/promo",
    validateRequest(
      z.object({
        body: z.object({
          value: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        const bonus = await AccountPromo(context.prisma, req.account, req.body);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          bonus,
          StatusCode.Ok,
        );

        return serviceResponse;
      } catch (error: any) {
        const message = (error as Error).message;
        if (["PromoNotFound", "PromoUsed", "PromoNoUses"].includes(message)) {
          return new ServiceResponse(
            ResponseStatus.Failed,
            message,
            null,
            StatusCode.BadRequest,
          );
        }

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
    "/update",
    validateRequest(
      z.object({
        body: z.object({
          language: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        await AccountUpdate(context.prisma, req.account, req.body);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          null,
          StatusCode.Ok,
        );

        return serviceResponse;
      } catch (error: any) {
        const message = (error as Error).message;
        if (["PromoNotFound", "PromoUsed", "PromoNoUses"].includes(message)) {
          return new ServiceResponse(
            ResponseStatus.Failed,
            message,
            null,
            StatusCode.BadRequest,
          );
        }

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
