const redis = require('./redis');

const streamProducer = async () => {
  console.log('TODO PRODUCER');
  console.log(await redis.client.ping());
  redis.client.quit();
};

streamProducer();