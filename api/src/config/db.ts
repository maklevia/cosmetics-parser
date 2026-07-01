import { Pool } from "pg";
import { getEnvOrThrow } from "../utils/getEnvOrThrow";

//pool for now, typeORM for later
const pool = new Pool({
  database: getEnvOrThrow('DB_NAME'),
  user: getEnvOrThrow('DB_USER'),
  password: getEnvOrThrow('DB_PASSWORD'),
  port: Number(getEnvOrThrow('DB_PORT')),
});

export default pool;
