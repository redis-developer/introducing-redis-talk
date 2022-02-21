import { client, STREAM_KEY_NAME } from './redis.js';
import { randomInRange, sleep} from './utils.js';

const MIN_LOCATION_ID = 1;
const MAX_LOCATION_ID = 100;
const MIN_TEMP_F = 14;
const MAX_TEMP_F = 86;
const MIN_HUMIDITY = 25;
const MAX_HUMIDITY = 99;
const MIN_GAP = 1000;
const MAX_GAP = 3000;

const streamProducer = async () => {
  console.log('Starting producer...');

  while (true) {
    const locationId = randomInRange(MIN_LOCATION_ID, MAX_LOCATION_ID, true);
    const temperature = randomInRange(MIN_TEMP_F, MAX_TEMP_F);
    const humidity = randomInRange(MIN_HUMIDITY, MAX_HUMIDITY);

    console.log(`Adding reading for location: ${locationId}, temperature: ${temperature}, humidity: ${humidity}`);
    
    const entryId = await client.xAdd(
      STREAM_KEY_NAME, 
      '*', // Let Redis set the entry ID
      {
        'location': locationId, 
        'temp': temperature, 
        'humidity': humidity
      }
    );

    console.log(`Added as ${entryId}`);
    await sleep(randomInRange(MIN_GAP, MAX_GAP, true));
  }
};

streamProducer();