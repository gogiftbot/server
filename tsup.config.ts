import * as path from "node:path";
import process from "node:process";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src"],
  outDir: "dist",
  splitting: false,
  clean: true,
  format: ["cjs"],
  target: "esnext",
  sourcemap: process.env.NODE_ENV === "development",
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
});
