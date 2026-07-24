export interface NewUserRow {
    userId: number,
    userEmail: string
}
export interface UserRow extends NewUserRow {
    name: string,
    telegramAccountId: number,
    passwordHash: string,
}