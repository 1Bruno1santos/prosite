import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../data/prosite.db');
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

async function runMigrations() {
  console.log('Running migrations...');
  console.log('Database path:', dbPath);
  
  try {
    migrate(db, {
      migrationsFolder: path.join(__dirname, '../migrations'),
    });
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

runMigrations();