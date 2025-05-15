import winston, { addColors, format } from "winston";

addColors({
  info: "bold blue",
  warn: "italic yellow",
  error: "bold red",
  debug: "green",
});

const initLogger = () =>
  winston.createLogger({
    level: "debug",
    format: format.combine(
      format.timestamp({
        format: "YY-MM-DD HH:MM:SS",
      }),
      format.json({ space: 2 }),
      format.colorize({
        all: true,
      }),
    ),
    transports: [new winston.transports.Console()],
  });

type LoggerI = ReturnType<typeof initLogger>;

export { initLogger, LoggerI };
