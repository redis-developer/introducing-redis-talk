import { createClient  } from 'redis';
import { readFile } from 'fs/promises';

const countUniques = async () => {
  const uniqueIds = JSON.parse(
    await readFile(new URL('./unique_ids.json', import.meta.url))
  );

  const client = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
    password: process.env.REDIS_PASSWORD
  });

  await client.connect();

  const HLL_KEY_NAME = "hlldemo";
  const SET_KEY_NAME = "setdemo";

  const BATCH_SIZE = 50;
  let startIndex = 0;
  let endIndex = BATCH_SIZE;
  let tmpArray = [];

  await client.del(HLL_KEY_NAME, SET_KEY_NAME);

  do {
    tmpArray = uniqueIds.slice(startIndex, endIndex);

    if (tmpArray.length === 0) {
      break;
    }
    
    await Promise.all([
      client.pfAdd(HLL_KEY_NAME, ...tmpArray),
      client.sAdd(SET_KEY_NAME, ...tmpArray)
    ]);

    startIndex += BATCH_SIZE;
    endIndex += BATCH_SIZE;
  } while (tmpArray.length === BATCH_SIZE);

  const [ hllCount, hllMemoryUsed, setCount, setMemoryUsed ] = await Promise.all([
    client.pfCount(HLL_KEY_NAME),
    client.memoryUsage(HLL_KEY_NAME),
    client.sCard(SET_KEY_NAME),
    client.memoryUsage(SET_KEY_NAME),
  ]);

  console.log(`HyperLogLog method: counted ${hllCount} unique items, memory used ${hllMemoryUsed} bytes.`);
  console.log(`Set method: counted ${setCount} unique items, memory used ${setMemoryUsed} bytes.`);

  await client.quit();
};

countUniques();
