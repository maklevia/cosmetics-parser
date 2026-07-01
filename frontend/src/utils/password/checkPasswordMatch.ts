export function confirmPasswordMatch(password: string, confirmPassword: string): string | null {
    if (!confirmPassword) {
        return 'Repeat your password'
    } else if (password !== confirmPassword) {
        return 'Passwords do not match!'
    } else 
        return null;
}