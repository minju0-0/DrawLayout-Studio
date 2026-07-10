/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function listTables() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
  }
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name");
    console.log('Tables in public schema:');
    for (const row of res.rows) console.log('-', row.table_name);
  } catch (err) {
    console.error('Error listing tables:', err);
    process.exit(2);
  } finally {
    await client.end();
  }
}

listTables();
