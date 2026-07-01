export function validatePassword(password: string): string | null {
    if (password.length < 6) {
        return 'Password must be at least 6 characters long!'
    }
    return null;
}