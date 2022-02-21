import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  password: process.env.REDIS_PASSWORD
});

await client.connect();

const STREAM_KEY_NAME = 'ingest:temphumidity';

export {
    client,
    STREAM_KEY_NAME
};