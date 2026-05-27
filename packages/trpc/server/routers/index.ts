import { router } from "../trpc.js";
import { healthRouter } from "../routes/health.js";
import { authRouter } from "../routes/auth/auth.route.js";
import { formRouter } from "../routes/form/form.route.js";
import { fieldRouter } from "../routes/field/field.route.js";
import { responseRouter } from "../routes/response/response.route.js";
import { analyticsRouter } from "../routes/analytics/analytics.route.js";
import { themeRouter } from "../routes/theme/theme.route.js";


export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  field: fieldRouter,
  response: responseRouter,
  analytics: analyticsRouter,
  theme: themeRouter,
});

export type AppRouter = typeof appRouter;
export type ServerRouter = AppRouter;
