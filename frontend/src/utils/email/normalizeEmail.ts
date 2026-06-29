export function normalizeEmail(email: string): string {
    const normalizedEmail: string = email.trim().toLowerCase();
    return normalizedEmail;
}