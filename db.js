
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'it_support_desk',
    password: process.env.DB_PASSWORD,
    port: 5432
});

module.exports = pool;
