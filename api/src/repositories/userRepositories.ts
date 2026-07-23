import pool from "@api/config/db.js";
import { NewUserRow, AuthUserRow, UserRow } from "@api/types/UserTypes.js";

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
    const user = await pool.query<AuthUserRow>(queryText, [userEmail]);
    if (user.rows.length === 0) {
        return null;
    }
    return user.rows[0];
  }

  async getUserById(userId: number): Promise<UserRow> {
    const queryText: string = `
    SELECT name, email,
    id AS "userId",
    telegram_account_id IS NOT NULL AS "isTelegramConnected"
    FROM Users
    WHERE id = $1`

    const result = await pool.query<UserRow>(queryText, [userId]);
    return result.rows[0];
  }

  //method is specific to Telegram channel
  async isTelegramAccountBinded(telegramAccountId: number): Promise<boolean> {
    const queryText: string = `
    SELECT 1 
    FROM Users
    WHERE telegram_account_id = $1
    LIMIT 1;`

    const response = await pool.query(queryText, [telegramAccountId]);
    return response.rowCount !== null && response.rowCount > 0;
  }
}
