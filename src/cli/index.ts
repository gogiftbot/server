import { execSync } from "child_process";
import path from "path";

const [name, ...args] = process.argv.slice(2);
console.log(`Running cli command "${name}"`);

const scriptPath = path.resolve(process.cwd(), `./src/cli/commands/${name}.ts`);

execSync(`tsx ${scriptPath} ${args.join(" ")}`, {
  stdio: "inherit",
});
