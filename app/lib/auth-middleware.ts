

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export type AuthenticatedUser = {
    id: string;
    companyId: string;
    roleId: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.id) {
            return null;
        }

        const user = await db.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, companyId: true, roleId: true },
        });

        if (!user || !user.companyId) {
            return null;
        }

        return {
            id: user.id,
            companyId: user.companyId,
            roleId: user.roleId,
        };
    } catch (error) {
        console.error("Auth middleware error:", error);
        return null;
    }
}

export function authenticatedAction<T>(
    action: (user: AuthenticatedUser, ...args: any[]) => Promise<T>
) {
    return async (...args: any[]): Promise<T> => {
        const user = await getAuthenticatedUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        return action(user, ...args);
    };
}
