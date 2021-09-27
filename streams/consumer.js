const redis = require('./redis');

const streamConsumer = async () => {
  console.log('TODO CONSUMER');
  console.log(await redis.client.ping());
  redis.client.quit();
};

streamConsumer();