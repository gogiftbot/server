import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import { PaymentOpen } from './payment.open'
import { PaymentCreate } from './payment.create'
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "@/services/response.service";

const callback: Callback = (router, context) => {
  router.post(
    "/create",
    validateRequest(
      z.object({
        body: z.object({
          caseId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        const data = await PaymentCreate(context.prisma, req.account, req.body);

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
    "/open",
    validateRequest(
      z.object({
        body: z.object({
          caseId: z.string(),
          transactionId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error('UNAUTHORIZED');

        const data = await PaymentOpen(context.prisma, req.account, req.body);

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
