import { getRandomNumber } from "@/utils/number";

export const intervalWrapper = async (
  callback: () => Promise<void>,
  options: { min: number; max: number },
) =>
  callback().finally(() =>
    setTimeout(
      () => intervalWrapper(callback, options),
      getRandomNumber(options.min, options.max) * 1000,
    ),
  );
