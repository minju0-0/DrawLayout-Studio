/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function dropSchema() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
  }
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log('Connected to DB, dropping public schema (CASCADE)');
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('Dropped and recreated public schema successfully');
  } catch (err) {
    console.error('Error while dropping schema:', err);
    process.exit(2);
  } finally {
    await client.end();
  }
}

dropSchema();
