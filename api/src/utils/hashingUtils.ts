import { hash, compare } from "bcrypt-ts";

export async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const result: string = await hash(password, saltRounds);
    return result;
}

export async function verifyPassword(passwordHash: string, password: string): Promise <boolean> {
    const match: boolean = await compare(password, passwordHash);
    return match;
}