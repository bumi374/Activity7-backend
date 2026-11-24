
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    user: process.env.DATABASE_URL ? undefined : 'postgres',
    host: process.env.DATABASE_URL ? undefined : 'localhost',
    database: process.env.DATABASE_URL ? undefined : 'it_support_desk',
    password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
    port: process.env.DATABASE_URL ? undefined : 5432,
    ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }
        : false
});

module.exports = pool;
