import Database from 'better-sqlite3';
import { DATA_PATH } from '../config';

const db = new Database(`${DATA_PATH}/data.db`);
process.on('exit', () => db.close());

export default db;
