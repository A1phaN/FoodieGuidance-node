import { mkdirSync } from 'fs';
import Database from 'better-sqlite3';
import { DATA_PATH } from '../config';

mkdirSync(DATA_PATH, { recursive: true });
const db = new Database(`${DATA_PATH}/data.db`);
process.on('exit', () => db.close());

export default db;
