export function confirmPasswordMatch(password: string, confirmPassword: string): string {
    if (password !== confirmPassword && confirmPassword) {
        return 'Passwords do not match!'
    } else 
        return '';
}