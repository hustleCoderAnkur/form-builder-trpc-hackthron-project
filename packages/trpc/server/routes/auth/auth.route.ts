import { z } from "zod";
import type { Response } from "express";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../../trpc.js";
import { createUser, loginUser } from "@repo/services/auth.service";
import { signJwt } from "../../lib/jwt.js";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
} from "./model.js";

const signupSchema = z.object({
  name: z.string().min(2, "Name too short").max(60),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function authResponse(user: { id: string; fullName: string; email: string }) {
  return { id: user.id, name: user.fullName, email: user.email };
}

export const authRouter = router({
  signup: publicProcedure.input(signupSchema).mutation(async ({ input, ctx }) => {
    try {
      const user = await createUser({
        ...input,
        email: input.email.trim().toLowerCase(),
      });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User creation failed",
        });
      }
      const token = signJwt({ userId: user.id, email: user.email });
      setAuthCookie(ctx.res, token);
      return authResponse(user);
    } catch (err) {
      if (err instanceof TRPCError) throw err;
      if (err instanceof Error && err.message.includes("JWT_SECRET")) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Server misconfigured: JWT_SECRET is missing",
        });
      }
      throw err;
    }
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const user = await loginUser({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    const token = signJwt({ userId: user.id, email: user.email });
    setAuthCookie(ctx.res, token);
    return authResponse(user);
  }),

  createUserWithEmailAndPassword: publicProcedure
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const user = await createUser({
        name: input.fullName,
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User creation failed",
        });
      }
      const token = signJwt({ userId: user.id, email: user.email });
      setAuthCookie(ctx.res, token);
      return { id: user.id };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("token", { path: "/" });
    return { success: true };
  }),

  me: protectedProcedure.query(({ ctx }) => ctx.user),
});
