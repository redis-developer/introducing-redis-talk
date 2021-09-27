const redis = require('./redis');

const CONSUMER_GROUP_NAME = "temphumidity_consumers";

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

  console.log(await redis.client.ping());
  redis.client.quit();
};

streamConsumerInGroup();