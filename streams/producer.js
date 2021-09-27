const redis = require('./redis');

const KEY_NAME = 'ingest:temphumidity';
const MIN_LOCATION_ID = 1;
const MAX_LOCATION_ID = 100;
const MIN_TEMP_F = 14;
const MAX_TEMP_F = 86;
const MIN_HUMIDITY = 25;
const MAX_HUMIDITY = 99;
const MIN_GAP = 1000;
const MAX_GAP = 3000;

const randomInRange = (min, max, wholeNumber) => {
  const num = Math.random() * (max - min) + min;
  return wholeNumber ? Math.floor(num) : Math.round(num * 10) / 10;
};

const sleep = (howLong) => { 
  return new Promise((resolve) => {
    setTimeout(resolve, howLong)
  })
};

const streamProducer = async () => {
  console.log('Starting producer...');

  while (true) {
    const locationId = randomInRange(MIN_LOCATION_ID, MAX_LOCATION_ID, true);
    const temperature = randomInRange(MIN_TEMP_F, MAX_TEMP_F);
    const humidity = randomInRange(MIN_HUMIDITY, MAX_HUMIDITY);
    console.log(`Adding reading for location: ${locationId}, temperature: ${temperature}, humidity: ${humidity}`);
    const entryId = await redis.client.xadd(redis.STREAM_KEY_NAME, '*', 'location', locationId, 'temp', temperature, 'humidity', humidity);
    console.log(`Added as ${entryId}`);
    await sleep(randomInRange(MIN_GAP, MAX_GAP, true));
  }
};

streamProducer();