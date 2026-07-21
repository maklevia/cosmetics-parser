import pool from "@api/config/db.js";
import { NewUserRow, UserRow } from "@api/types/UserTypes.js";

export class UserRepositories {
  async createUser(userEmail: string, userPassword: string) {
    const queryText = `
        INSERT INTO Users (email, password)
        VALUES ($1, $2)
        RETURNING id AS "userId", email AS "userEmail"`;

    const result = await pool.query<NewUserRow>(queryText, [
      userEmail,
      userPassword,
    ]);
    return result.rows[0];
  }

  async getUserByEmail(userEmail: string) {
    const queryText: string = `
            SELECT id AS "userId",
            name,
            email AS "userEmail",
            telegram_account_id AS "telegamAccountId",
            password AS "passwordHash"
            FROM Users
            WHERE email=$1
            LIMIT 1;
            `;
    const user = await pool.query<UserRow>(queryText, [userEmail]);
    if (user.rows.length === 0) {
        return null;
    }
    return user.rows[0];
  }
}
