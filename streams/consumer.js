import { client, STREAM_KEY_NAME } from './redis.js';
import { randomInRange, sleep} from './utils.js';
import { commandOptions } from 'redis';

const LAST_ID_KEY = 'consumer:lastid';
const BLOCK_TIME = 5000;
const MIN_WORK_DURATION = 1000;
const MAX_WORK_DURATION = 5000;

const streamConsumer = async () => {
  console.log('Starting consumer...');

  // Did we store a previous last ID?
  let lastId = await client.get(LAST_ID_KEY);

  if (! lastId) {
    // No stored last ID, so start from the beginning...
    lastId = '0';
    console.log('Reading from the start of the stream.');
  } else {
    console.log(`Resuming from ID ${lastId}`);
  }

  while (true) {
    console.log('Reading stream...');
    const response = await client.xRead(
      commandOptions(
        {
          isolated: true
        }
      ), [
        {
          key: STREAM_KEY_NAME,
          id: lastId
        }
      ], {
        COUNT: 1,
        BLOCK: BLOCK_TIME
      }
    );

    if (response) {
      // Unpack response...
      const entry = response[0].messages[0];
      
      console.log(`Received entry ${entry.id}:`);
      console.log(entry.message);

      // Simulate some work
      await sleep(randomInRange(MIN_WORK_DURATION, MAX_WORK_DURATION, true));
      console.log(`Finished working with entry ${entry.id}`);

      // Update the last ID we have seen.
      lastId = entry.id;
      await client.set(LAST_ID_KEY, lastId);
    } else {
      console.log(`No new entries since entry ${lastId}.`);
    }
  }
};

streamConsumer();