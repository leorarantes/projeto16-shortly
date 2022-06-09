import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connection = new Pool({
    user: 'postgres',
    password: process.env.PASSWORD,
    host: 'localhost',
    port: 5432,
    database: 'shortly'
});

export default connection;