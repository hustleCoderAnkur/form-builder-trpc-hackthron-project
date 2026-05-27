import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getUserById } from "@repo/services/auth.service";
import jwt from "jsonwebtoken";

export type JWTPayload = { userId: string; email: string };

export async function createContext({ req, res }: CreateExpressContextOptions) {
    let user: Awaited<ReturnType<typeof getUserById>> | null = null;

    const token = req.cookies?.["token"];

    if (token) {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as JWTPayload;
            user = await getUserById(payload.userId);
        } catch {
        }
    }

    return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
export type AuthUser = NonNullable<Context["user"]>;