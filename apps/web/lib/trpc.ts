import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@repo/trpc";

export { cn } from "./utils";
export const trpc = createTRPCReact<AppRouter>();
