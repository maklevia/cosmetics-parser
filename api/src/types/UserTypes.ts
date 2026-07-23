export interface NewUserRow {
    userId: number,
    userEmail: string
}
export interface AuthUserRow extends NewUserRow {
    name?: string,
    passwordHash: string,
}
export interface UserRow extends NewUserRow {
    name?: string;
    isTelegramConnected: boolean;
}