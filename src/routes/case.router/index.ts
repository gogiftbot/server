import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import { CasesGet } from "./cases.get";
import { CaseOpen } from "./cases.open";
import { CaseOpenFree } from "./cases.open.free";
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "@/services/response.service";

const callback: Callback = (router, context) => {
  router.get(
    "/",
    validateRequest(z.object({})),
    routeWrapper(async (req) => {
      try {
        const cases = await CasesGet(context.prisma, req.account);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          cases,
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
          isDemo: z.boolean().optional(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error("UNAUTHORIZED");

        const data = await CaseOpen(context, req.account, req.body);

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
    "/free/open",
    validateRequest(z.object({})),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error("UNAUTHORIZED");

        const data = await CaseOpenFree(context.prisma, req.account, req.body);

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
