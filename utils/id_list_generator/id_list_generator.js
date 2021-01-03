const cleanShortId = require('clean-shortid');
const fs = require('fs');
const ids = new Set();

const MAX_TO_GENERATE = 500000;
const FILENAME = 'unique_ids.json';

while (ids.size < MAX_TO_GENERATE) {
    ids.add(cleanShortId.generate());

    if (ids.size % 5000 === 0) {
        process.stdout.write('.');
    }
}

fs.writeFileSync('./unique_ids.json', JSON.stringify(Array.from(ids)));

console.log(`\nGenerated ${ids.size} uniques in ${FILENAME}.`);
