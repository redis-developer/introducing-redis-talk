const redis = require('./redis');

const streamConsumerInGroup = async () => {
  console.log('TODO GROUP CONSUMER');
  if (process.argv.length !== 4) {
    console.error(`usage: npm run consumergroup <consumer name>`);
    process.exit(1);
  }

  console.log(await redis.client.ping());
  redis.client.quit();
};

streamConsumerInGroup();