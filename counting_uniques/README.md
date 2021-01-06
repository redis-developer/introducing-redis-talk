# Counting Uniques

This demo compares counting unique items using a [Redis Set](https://redis.io/topics/data-types) (count will be accurate, but takes up memory proportional to the number of items) and a [Redis Hyperloglog](http://antirez.com/news/75) (count will be approximated, but takes up maximum 12kb no matter how many items).

The unique items to count are in the file `unique_ids.json`.  This contains 500,000 items.

### Setup

You will need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set.  Once you have Redis installed and running:

```bash
$ npm install
$ npm start
```

### Output

The demo logs the number of unique items counted and memory used for each data type.

Example:

```bash
$ npm start

> counting_uniques@1.0.0 start /Users/simon/source/github/introducing-redis-talk/counting_uniques
> node count_uniques.js

HyperLogLog method: counted 498384 unique items, memory used 12359 bytes.
Set method: counted 500000 unique items, memory used 23494449 bytes.
```
