import expressWinston from "express-winston";

const loggerMiddleware = (logger: Context["logger"]) =>
  expressWinston.logger({
    winstonInstance: logger,
    responseWhitelist: ["body", "query", "statusCode"],
    requestWhitelist: ["query", "body"],
    expressFormat: true,
  });

export { loggerMiddleware };
