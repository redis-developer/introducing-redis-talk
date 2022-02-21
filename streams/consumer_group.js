import { client, STREAM_KEY_NAME } from './redis.js';
import { randomInRange, sleep} from './utils.js';
import { commandOptions } from 'redis';

const CONSUMER_GROUP_NAME = "temphumidity_consumers";
const BLOCK_TIME = 5000;
const MIN_WORK_DURATION = 1000;
const MAX_WORK_DURATION = 5000;

const streamConsumerInGroup = async () => {
  if (process.argv.length !== 4) {
    console.error(`usage: npm run consumergroup <consumer name>`);
    process.exit(1);
  }

  const consumerName = process.argv[3];
  console.log(`Starting consumer ${consumerName}...`);

  // Set up the consumer group if it hasn't already been created...
  let consumerGroupStatus = 'created';

  try {
    await client.xGroupCreate(STREAM_KEY_NAME, CONSUMER_GROUP_NAME, 0);
  } catch (err) {
    consumerGroupStatus = 'exists, not created';  
  }

  console.log(`Consumer group ${CONSUMER_GROUP_NAME} ${consumerGroupStatus}.`);
  
  while (true) {
    console.log('Reading stream...');
    const response = await client.xReadGroup(
      commandOptions(
        {
          isolated: true
        }
      ),
      CONSUMER_GROUP_NAME, 
      consumerName, [
        {
          key: STREAM_KEY_NAME,
          id: '>'
        }
      ], {
        COUNT: 1,
        BLOCK: BLOCK_TIME
      }
    );
    
    if (response) {
      // Unpack some things from the response...
      const entry = response[0].messages[0];
      
      console.log(`Received entry ${entry.id}:`);
      console.log(entry.message);

      // Simulate some work
      await sleep(randomInRange(MIN_WORK_DURATION, MAX_WORK_DURATION, true));

      // Positively acknowledge this message has been processed.
      await client.xAck(STREAM_KEY_NAME, CONSUMER_GROUP_NAME, entry.id);
      console.log(`Acknowledged processing of entry ${entry.id}.`);
    } else {
      console.log('No new entries yet.');
    }
  }
};

streamConsumerInGroup();