import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('[dev] Starting MongoMemoryServer...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'orpind',
    },
  });
  const uri = mongod.getUri();
  console.log(`[dev] MongoDB running at: ${uri}`);

  process.env.MONGO_URI = uri;

  const env = {
    ...process.env,
    MONGO_URI: uri,
    NODE_ENV: 'development',
    PORT: '4000',
  };

  const nodeBin = process.execPath;
  const seederPath = path.resolve(__dirname, 'src', 'database', 'seeders', 'index.js');

  if (fs.existsSync(seederPath)) {
    console.log('[dev] Seeding database...');
    await new Promise((resolve) => {
      const seeder = spawn(nodeBin, [seederPath], { env, stdio: 'inherit', cwd: __dirname });
      seeder.on('close', (code) => {
        if (code === 0) console.log('[dev] Database seeded');
        else console.warn(`[dev] Seeder exited with code ${code}`);
        resolve();
      });
    });
  }

  const serverPath = path.resolve(__dirname, 'src', 'server.js');

  if (!fs.existsSync(serverPath)) {
    console.error(`[dev] Server file not found: ${serverPath}`);
    await mongod.stop();
    process.exit(1);
  }

  const child = spawn(nodeBin, [serverPath], {
    env,
    stdio: 'inherit',
    cwd: __dirname,
  });

  child.on('close', async (code) => {
    console.log(`[dev] Server exited with code ${code}`);
    await mongod.stop();
    process.exit(code);
  });

  process.on('SIGINT', async () => {
    console.log('\n[dev] Shutting down...');
    child.kill('SIGINT');
    await mongod.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    child.kill('SIGTERM');
    await mongod.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[dev] Failed to start:', err);
  process.exit(1);
});
