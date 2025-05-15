import { z } from "zod";

export enum ResponseStatus {
  Success = "Success",
  Failed = "Failed",
}

export enum StatusCode {
  NotFound = 404,
  Ok = 200,
  InternalServerError = 500,
  BadRequest = 400,
}

export class ServiceResponse<T = null> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;

  constructor(
    status: ResponseStatus,
    message: string,
    responseObject: T,
    statusCode: number,
  ) {
    this.success = status === ResponseStatus.Success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });
