import fs from "fs";
import path from "path";

import { initContext } from "./modules/context";

const __dirname = path.resolve(path.dirname(""));

const sleep = (seconds = 1) =>
  new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));

const logHeapSize = () => {
  const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Used approximately ${Math.round(memoryUsed * 100) / 100} MB`);
};

const toFile = <T>(data: T, name = Date.now().toString()) => {
  fs.writeFileSync(__dirname + `/${name}.json`, JSON.stringify(data, null, 3));
};

const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

type ParsedParameters = { [key: string]: string };
const parseParameters = (parameters: string[]) => {
  const parsedParameters: ParsedParameters = {};
  for (const parsedParameter of parameters) {
    if (parsedParameter.startsWith("--")) {
      const [key, value] = parsedParameter.split("=");
      parsedParameters[key.replace("--", "")] = value || "true";
    }
  }
  return parsedParameters;
};

const wrapper = async <T>(
  callback: (payload: {
    parameters: string[];
    parsed: ParsedParameters;
    context: Context;
  }) => Promise<T>,
  exit = true,
) => {
  const parameters = process.argv.slice(3);
  const parsed = parseParameters(parameters);
  console.log("cli parameters:", parameters, parsed);

  const context = await initContext();

  console.time("cli");

  try {
    await callback({
      parameters,
      parsed,
      context,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.timeEnd("cli");
  logHeapSize();

  if (exit) {
    process.exit(0);
  }
};

export { wrapper, sleep, logHeapSize, toFile, chunkArray };
