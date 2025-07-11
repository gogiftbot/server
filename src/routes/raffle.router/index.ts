import { z } from "zod";

import {
  createRouter,
  Callback,
  validateRequest,
  routeWrapper,
} from "../utils";
import { RafflesGet } from "./raffles.get";
import { RaffleParticipate } from "./raffle.participate";
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "@/services/response.service";
import { BotService } from "@/services/bot.service";

const callback: Callback = (router, context) => {
  const botService = new BotService(context.prisma);

  router.get(
    "/",
    validateRequest(z.object({})),
    routeWrapper(async (req) => {
      try {
        const raffles = await RafflesGet(context.prisma, req.account);

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          raffles,
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
    "/participate",
    validateRequest(
      z.object({
        body: z.object({
          raffleId: z.string(),
        }),
      }),
    ),
    routeWrapper(async (req) => {
      try {
        if (!req.account) throw new Error("UNAUTHORIZED");

        await RaffleParticipate(
          context.prisma,
          req.account,
          req.body,
          botService,
        );

        const serviceResponse = new ServiceResponse(
          ResponseStatus.Success,
          "Success",
          {},
          StatusCode.Ok,
        );

        return serviceResponse;
      } catch (error: any) {
        const message = (error as Error).message;
        if (
          ["RAFFLE_PARTICIPANT", "RAFFLE_COMPLETED"].includes(message) ||
          message.startsWith("TASK")
        ) {
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

  // router.post(
  //   "/free/open",
  //   validateRequest(z.object({})),
  //   routeWrapper(async (req) => {
  //     try {
  //       if (!req.account) throw new Error("UNAUTHORIZED");

  //       const data = await CaseOpenFree(context.prisma, req.account, req.body);

  //       const serviceResponse = new ServiceResponse(
  //         ResponseStatus.Success,
  //         "Success",
  //         data,
  //         StatusCode.Ok,
  //       );

  //       return serviceResponse;
  //     } catch (error: any) {
  //       return new ServiceResponse(
  //         ResponseStatus.Failed,
  //         "Bad request",
  //         null,
  //         StatusCode.BadRequest,
  //       );
  //     }
  //   }),
  // );
};

export default (context: Context) => createRouter(context, callback);
