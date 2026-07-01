import * as EmailValidator from 'email-validator'

export function validateEmail(email: string): string | null {
    if (!email.trim()) {
        return 'Email is required!'
    } else if (!EmailValidator.validate(email)) {
        return 'Provide a valid email!'
    } else 
        return null;
}