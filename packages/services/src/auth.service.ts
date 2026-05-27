import bcrypt from "bcryptjs";
import { db, usersTable } from "@formbit/database";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export async function createUser(input: {
    name: string;
    email: string;
    password: string;
}) {
    const email = input.email.trim().toLowerCase();

    const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    if (existing.length > 0) {
        throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered",
        });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const [user] = await db
        .insert(usersTable)
        .values({
            fullName: input.name,
            email,
            password: passwordHash,
        })
        .returning();

    return user;
}

export async function loginUser(input: {
    email: string;
    password: string;
}) {
    const email = input.email.trim().toLowerCase();

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
        });
    }
    
    const valid = user.password
        ? await bcrypt.compare(input.password, user.password)
        : false;

    if (!valid) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
        });
    }

    return user;
}

export async function getUserById(id: string) {
    const [user] = await db
        .select({
            id: usersTable.id,
            name: usersTable.fullName,
            email: usersTable.email,
            createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);

    return user ?? null;
}