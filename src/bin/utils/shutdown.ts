export const onShutdown = (
  beforeExitCallback: (error?: Error) => Promise<void> | void,
) => {
  process.on("SIGTERM", async () => {
    await beforeExitCallback();

    console.debug("SIGTERM");
    process.exit(0);
  });
  process.on("SIGINT", async () => {
    await beforeExitCallback();

    console.debug("SIGINT");
    process.exit(0);
  });

  process.on("uncaughtException", async (error) => {
    await beforeExitCallback(error);

    console.error("uncaughtException", error);
    process.exit(1);
  });
  process.on("unhandledRejection", async (error: Error) => {
    await beforeExitCallback(error);

    console.error("unhandledRejection", error);
    process.exit(1);
  });
};
