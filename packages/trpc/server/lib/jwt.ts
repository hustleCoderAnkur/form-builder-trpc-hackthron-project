import jwt from "jsonwebtoken";

export type JWTPayload = { userId: string; email: string };

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
};

export function signJwt(payload: JWTPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" as const });
}

export function verifyJwt(token: string): JWTPayload {
  return jwt.verify(token, getSecret()) as JWTPayload;
}
