import { Pool } from "pg";


//pool for now, typeORM for later
const pool: Pool = new Pool({
  database: process.env.DB_NAME || "mydb",
  user: process.env.DB_USER || "myuser",
  password: process.env.DB_PASSWORD || "pass",
  port: Number(process.env.DB_PORT) || 5432,
});

export default pool;
