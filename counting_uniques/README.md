# Counting Uniques

This demo compares counting unique items using a [Redis Set](https://redis.io/topics/data-types) (count will be accurate, but takes up memory proportional to the number of items) and a [Redis Hyperloglog](http://antirez.com/news/75) (count will be approximated, but takes up maximum 12kb no matter how many items).

The unique items to count are in the file `unique_ids.json`.  This contains 500,000 items.

## Setup

Download and install an LTS version of [Node.js](https://nodejs.org/en/download/) (Tested with version 14.16.0).

You will also need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set.  If you have Docker, see the instructions in the main [README](../README.md) - I've provided a Docker Compose file that will start a container with Redis for you.

If you're running Redis elsewhere, you'll need to set environment variables as follows for the host, port and optionally password that Redis is running on:

```bash
$ export REDIS_HOST=<your Redis hostname>
$ export REDIS_PORT=<your Redis port name>
$ export REDIS_PASSWORD=<your Redis password as needed>

Once you have Redis installed and running:

```bash
$ npm install
$ npm start
```

## Output

The demo logs the number of unique items counted and memory used for each data type.

Example:

```bash
$ npm start

> counting_uniques@1.0.0 start /Users/simon/source/github/introducing-redis-talk/counting_uniques
> node count_uniques.js

HyperLogLog method: counted 498384 unique items, memory used 12359 bytes.
Set method: counted 500000 unique items, memory used 23494449 bytes.
```
