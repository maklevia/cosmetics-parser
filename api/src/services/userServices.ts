import { QueryResult, QueryResultRow } from "pg";
import pool from "../config/db";
import { hashPassword, verifyPassword } from "../utils/hashingUtils";

const UserService = {
  getUserByEmail: async (email: string): Promise<QueryResultRow | null> => {
    const queryText: string = `
            SELECT *
            FROM Users
            WHERE email=$1
            LIMIT 1;
            `;
    try {
      const user: QueryResult = await pool.query(queryText, [email]);
      return user.rows[0];
    } catch (error) {
      console.log("API UserService: error searching for user in DB: ", error);
      return null;
    }
  },

  createUser: async (email: string, password: string): Promise<QueryResultRow | null> => {
    try {
      const hashedPassword: string = await hashPassword(password);

      const queryText: string = `
      INSERT INTO Users
      (email, password) 
      VALUES ($1, $2) 
      RETURNING id, email
      `;
      const createdUser: QueryResult = await pool.query(queryText, [email, hashedPassword])
      return createdUser.rows[0];
    } catch (error) {
        console.log('API User Service: error creating new user in DB: ', error);
        return null;
    }
  },

};

export default UserService;
