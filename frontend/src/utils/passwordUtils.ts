export function validatePassword(password: string): string[] {
  const reasons: string[] = [];
  if (password.length > 0) {
    if (password.length < 6) {
      reasons.push("Password must be at least 6 characters long!");
    }
    if (!/\d/.test(password)) {
      reasons.push("Password should contain at least one number!");
    }
    if (!/[A-Z]/.test(password)) {
      reasons.push("Password should contain at least one capital letter!");
    }
  }
  return reasons;
}

export function confirmPasswordMatch(password: string, confirmPassword: string): string {
    if (password !== confirmPassword && confirmPassword) {
        return 'Passwords do not match!'
    } else 
        return '';
}