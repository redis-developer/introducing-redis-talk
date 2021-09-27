const redis = require('./redis');
const utils = require('./utils');

const LAST_ID_KEY = 'consumer:lastid';
const BLOCK_TIME = 5000;
const MIN_WORK_DURATION = 1000;
const MAX_WORK_DURATION = 5000;

const streamConsumer = async () => {
  console.log('Starting consumer...');

  // Did we store a previous last ID?
  let lastId = await redis.client.get(LAST_ID_KEY);

  if (! lastId) {
    // No stored last ID, so start from the beginning...
    lastId = '0';
    console.log('Reading from the start of the stream.');
  } else {
    console.log(`Resuming from ID ${lastId}`);
  }

  while (true) {
    console.log('Reading stream...');
    const response = await redis.client.xread('BLOCK', BLOCK_TIME, 'STREAMS', redis.STREAM_KEY_NAME, lastId);

    if (response) {
      // Unpack some things from the array of arrays response.
      const entry = response[0][1][0];
      const entryId = entry[0];
      const entryPayload = entry[1];
      
      console.log(`Received entry ${entryId}:`);
      console.log(entryPayload);

      // Simulate some work
      await utils.sleep(utils.randomInRange(MIN_WORK_DURATION, MAX_WORK_DURATION, true));
      console.log(`Finished working with entry ${entryId}`);

      // Update the last ID we have seen.
      lastId = entryId;
      await redis.client.set(LAST_ID_KEY, lastId);
    } else {
      console.log(`No new entries since entry ${lastId}.`);
    }
  }
};

streamConsumer();