const redis = require('./redis');
const utils = require('./utils');

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
    await redis.client.xgroup('CREATE', redis.STREAM_KEY_NAME, CONSUMER_GROUP_NAME, 0);
  } catch (err) {
    consumerGroupStatus = 'exists, not created';  
  }

  console.log(`Consumer group ${CONSUMER_GROUP_NAME} ${consumerGroupStatus}.`);

  while (true) {
    console.log('Reading stream...');
    const response = await redis.client.xreadgroup('GROUP', CONSUMER_GROUP_NAME, consumerName, 'COUNT', 1, 'BLOCK', BLOCK_TIME, 'STREAMS', redis.STREAM_KEY_NAME, '>');
    
    if (response) {
      // Unpack some things from the array of arrays response.
      const entry = response[0][1][0];
      const entryId = entry[0];
      const entryPayload = entry[1];
      
      console.log(`Received entry ${entryId}:`);
      console.log(entryPayload);

      // Simulate some work
      await utils.sleep(utils.randomInRange(MIN_WORK_DURATION, MAX_WORK_DURATION, true));

      // Positively acknowledge this message has been processed.
      await redis.client.xack(redis.STREAM_KEY_NAME, CONSUMER_GROUP_NAME, entryId);
      console.log(`Acknowledged processing of entry ${entryId}.`);
    } else {
      console.log('No new entries yet.');
    }
  }
};

streamConsumerInGroup();