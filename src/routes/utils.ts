import express from "express";
import {
  ResponseStatus,
  ServiceResponse,
  StatusCode,
} from "services/response.service";
import { ZodError, ZodSchema } from "zod";

export type Callback = (router: express.Router, context: Context) => void;

export const routeWrapper =
  <T>(
    callback: (
      req: express.Request,
      res: express.Response,
    ) => Promise<ServiceResponse<T>>,
  ) =>
  (req: express.Request, res: express.Response, _next: express.NextFunction) =>
    callback(req, res)
      .catch((ex: Error) => {
        return new ServiceResponse(
          ResponseStatus.Failed,
          ex.message,
          null,
          StatusCode.InternalServerError,
        );
      })
      .then((serviceResponse) => handleServiceResponse(serviceResponse, res));

export const createRouter = (
  context: Context,
  callback: (r: express.Router, context: Context) => void,
): express.Router => {
  const router = express.Router();

  callback(router, context);

  return router;
};

export const handleServiceResponse = (
  serviceResponse: ServiceResponse<any>,
  response: express.Response,
) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  (schema: ZodSchema) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      console.log("req.body", req.body);
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`;
      const statusCode = 400;
      res
        .status(statusCode)
        .send(
          new ServiceResponse<null>(
            ResponseStatus.Failed,
            errorMessage,
            null,
            statusCode,
          ),
        );
    }
  };
