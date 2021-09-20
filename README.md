# Introducing Redis, the Database that Developers Love!

Redis was named Most Loved Database in Stack Overflow's developer survey for each of the last four years. In this session, you'll discover what [Redis](https://redis.io) is, why developers like it so much, and when to use its unique capabilities.

Often thought of as a cache, there's so much more to Redis. [Simon Prickett](https://simonprickett.dev/) will show you how to add Redis to your stack to improve performance, synchronize communications between distributed systems and even save you from writing lots of code.

We'll look at concrete use cases written in Python, JavaScript (Node.js) and Java. This introductory session is suitable for coders of all levels.

We will walk through:

* An overview of the Redis data model
* Basic String demo ([Python code](basics/))
* Connecting microservices together with queues ([Python code](queuing/))
* Counting unique items ([Node.js code](counting_uniques))
* Caching data for performance ([Java code](caching/))
* Full text search and secondary indexing ([Python code](full_text_search_and_secondary_indexing/))

Watch a video of the presentation:

* As delivered to the Virtual Coffee community [here](https://youtu.be/lCYY2cRy7N8?t=140) (YouTube).
* As delivered to the CFE.dev community [here](https://cfe.dev/events/introduction-to-redis/) (free cfe.dev account required).

## Presenter Bio

[Simon Prickett](https://simonprickett.dev/) is the Developer Advocacy Manager at [Redis](https://redis.com), responsible for Redis University's [online training courses](https://university.redis.com/#courses) and creation of other video and written content.  Previously, he's worked as a software architect in the power, food, logistics, entertainment and law enforcement industries.  Simon loves helping people learn about tech.  He also enjoys creating gadgets that mix hardware with software, and regularly blogs and publishes videos about his latest Raspberry Pi, Arduino and Alexa projects.  Simon is partial to Aeropress coffee and never misses an opportunity to say hi to new dogs.

## Starting Redis

This repo includes a docker-compose.yaml file that gets you an instance of Redis 6 with the RediSearch module installed.

To use it:

```bash
$ docker-compose up -d
```

Then connect to Redis on `localhost` port `6379`, for example using [RedisInsight](https://redis.com/redis-enterprise/redis-insight/).

When you're finished using Redis:

```bash
$ docker-compose down
```
