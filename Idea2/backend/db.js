import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const file = new URL('./data.json', import.meta.url);
const adapter = new JSONFile(file);
const defaultData = { profiles: [], likes: [], passes: [] };

const db = new Low(adapter, defaultData);
await db.read();
if (!db.data) {
  db.data = defaultData;
  await db.write();
}

export default db;
