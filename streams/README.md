# Streams

This demo shows how to add entries to a [Redis Stream](https://redis.io/topics/streams-intro), and consume the stream using a standalone consumer instance and a group of consumers that collaborate.  The three components of the system are connected together using a Stream at the Redis key `ingest:temphumidity`.

* The Producer component generates random temperature/humidity values for a set of locations, adding a new one to the stream every few seconds.  It uses the [XADD](https://redis.io/commands/xadd) command.
* The Consumer component reads entries from the stream, logs them to the console and pauses for a random amount of time to simulate "processing" the data, before reading from the stream again.  Once it has read all of the entries, it will wait for more to be added.  It uses the blocking version of the [XREAD](https://redis.io/commands/xread) command, and remembers the ID of the last entry it read (using Redis to store this as a string at key `consumer:lastid`)... this means that you can stop the consumer, restart it and it will pick up from where it left off in the stream.
* The Consumer Group component also reads entries from the stream, but as part of a Redis Streams consumer group.  This is a mechanism whereby Redis tracks which instance of a consumer in a given group has processed which entries from the stream, and shares the workload of processing the stream between the instances in the group.  This achieves higher throughput than using a single consumer instance.  This component uses the [XGROUP](https://redis.io/commands/xgroup), [XREADGROUP](https://redis.io/commands/xreadgroup) and [XACK](https://redis.io/commands/xack) commands.  There's no need for the consumer to track the ID of the last entry it received in this case, this is done for us by Redis.  See the [Redis Streams overview](https://redis.io/topics/streams-intro) for more detail about consumer groups.

To watch entries get added to the stream in real time, use the Stream view in RedisInsight ([free download](https://redis.com/redis-enterprise/redis-insight/)).

## Setup

Download and install an LTS version of [Node.js](https://nodejs.org/en/download/) (Tested with v14.16.0).

You will also need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set.  If you have Docker, see the instructions in the main [README](../README.md) - I've provided a Docker Compose file that will start a container with Redis for you.

Once you have Redis installed and running, download the dependencies:

```bash
$ npm install
```

If your Redis instance is not on `localhost:6379` with no password required to connect, you'll need to set some environment variables as follows, e.g. to connect to Redis on myhost port 6380 with password 'hello':

```bash
export REDIS_HOST=myhost
export REDIS_PORT=6380
export REDIS_PASSWORD=hello
```

## Running the Producer

To start the producer, which will add a new entry to the stream every few seconds:

```bash
$ npm run producer

> streams@1.0.0 producer
> node producer.js

Starting producer...
Adding reading for location: 62, temperature: 40.3, humidity: 36.5
Added as 1632771056648-0
Adding reading for location: 96, temperature: 15.4, humidity: 70
Added as 1632771059039-0
...
```

The producer will run indefinitely, press Ctrl-C to stop it.  You can start multiple instances of the producer if you want to add entries to the stream faster.

## Running the Consumer

To start the consumer, which reads from the stream every few seconds:

```bash
$ npm run consumer

> streams@1.0.0 consumer
> node consumer.js

Starting consumer...
Resuming from ID 1632744741693-0
Reading stream...
Received entry 1632771056648-0:
[ 'location', '62', 'temp', '40.3', 'humidity', '36.5' ]
Finished working with entry 1632771056648-0
Reading stream...
Received entry 1632771059039-0:
[ 'location', '96', 'temp', '15.4', 'humidity', '70' ]
```

The consumer stores the last entry ID that it read in a Redis string at the key `consumer:lastid`.  It uses this to pick up from where it left off after it is restarted.  Try this out by stopping it with Ctrl-C and restarting it.

Once the consumer has processed every entry in the stream, it will wait indefinitely for instances of the producer to add more:

```bash
Reading stream...
No new entries since entry 1632771060229-0.
Reading stream...
No new entries since entry 1632771060229-0.
Reading stream...
```

Stop it with Ctrl-C.

## Running a Consumer Group

A consumer group consists of multiple consumer instances working together.  Redis manages allocation of entries read from the stream to members of a consumer group.  A consumer in a group will receive a subset of the entries, with the group as a whole receiving all of them.  When working in a consumer group, a consumer process must acknowledge receipt/processing of each entry.

Using multiple terminal windows, start three instances of the consumer group consumer, giving each a unique name:

```bash
$ npm run consumergroup consumer1

> streams@1.0.0 consumergroup
> node consumer_group.js -- "consumer1"

Starting consumer consumer1...
Consumer group temphumidity_consumers exists, not created.
Reading stream...
Received entry 1632771059039-0:
[ 'location', '96', 'temp', '15.4', 'humidity', '70' ]
Acknowledged processing of entry 1632771059039-0.
Reading stream...
```

In a second terminal:

```bash
$ npm run consumergroup consumer2
```

and in a third:

```bash
$ npm run consumergroup consumer3
```

The consumers will run indefinitely, waiting for new messages to be added to the stream by a producer instance when they have collectively consumed the entire stream.  Note that in this model, each consumer instance does not receive all of the entries from the stream, but the three members of the group each receive a subset.

To look at how Redis tracks the overall state of the consumer group, use the Streams view in [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) (free download).