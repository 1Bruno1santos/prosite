import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const dbPath = path.join(dataDir, 'prosite.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory:', dataDir);
}

// Check if database file exists
if (fs.existsSync(dbPath)) {
  console.log('Database already exists at:', dbPath);
} else {
  console.log('Database will be created at:', dbPath);
}

// Read migration file
const migrationPath = path.join(__dirname, '../migrations/0000_right_marvel_boy.sql');
if (fs.existsSync(migrationPath)) {
  console.log('Migration file found:', migrationPath);
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  console.log('Migration SQL loaded, length:', migrationSQL.length);
} else {
  console.error('Migration file not found:', migrationPath);
}

console.log('Setup check complete. Run migrations to create tables.');