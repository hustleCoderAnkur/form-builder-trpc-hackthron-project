import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "es2022",
  clean: true,
  noExternal: [
    "@repo/logger",
    "@repo/services",
    "@repo/shared",
    "@repo/trpc",
  ],
});