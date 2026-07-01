import { QueryResultRow } from "pg";
import pool from "@api/config/db";
import AuthService from "@api/services/authServices";

const UserService = {
  getUserByEmail: async (email: string): Promise<QueryResultRow | null> => {
    const queryText: string = `
            SELECT *
            FROM Users
            WHERE email=$1
            LIMIT 1;
            `;
    try {
      const user = await pool.query(queryText, [email]);
      return user.rows[0];
    } catch (error) {
      console.log("API UserService: error searching for user in DB: ", error);
      return null;
    }
  },

  createUser: async (email: string, password: string): Promise<QueryResultRow | null> => {
    try {
      const hashedPassword = await AuthService.hashPassword(password);

      const queryText: string = `
      INSERT INTO Users
      (email, password) 
      VALUES ($1, $2) 
      RETURNING id, email
      `;
      const createdUser = await pool.query(queryText, [email, hashedPassword])
      return createdUser.rows[0];
    } catch (error) {
        console.log('API User Service: error creating new user in DB: ', error);
        return null;
    }
  },

};

export default UserService;
