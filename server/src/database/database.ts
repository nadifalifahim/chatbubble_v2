import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

export const db = {
  pool: new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  }),
};

export default db;
