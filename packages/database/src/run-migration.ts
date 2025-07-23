import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const dbPath = path.join(dataDir, 'prosite.db');
const migrationPath = path.join(__dirname, '../migrations/0000_right_marvel_boy.sql');

async function runMigration() {
  try {
    // Create data directory
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read migration SQL
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Execute SQL using sqlite3 command line
    console.log('Running migration...');
    const { stdout, stderr } = await execAsync(`sqlite3 "${dbPath}" < "${migrationPath}"`);
    
    if (stderr) {
      console.error('Migration error:', stderr);
    } else {
      console.log('Migration completed successfully!');
      if (stdout) console.log(stdout);
    }
  } catch (error) {
    console.error('Failed to run migration:', error);
    process.exit(1);
  }
}

runMigration();