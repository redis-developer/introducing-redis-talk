# Caching

This demo shows how to cache the response from a call to an external API using Redis.  It fetches currency exchange rate information for a given day from [https://exchangeratesapi.io/](https://exchangeratesapi.io/) and caches it in Redis as a String value for 15 seconds.

When the code is run, it will first look in Redis to see if there is a cached response, returning that if so. If there isn't, it will fetch the data from the origin API, store it in Redis, set the expiry time to 15 seconds and return the data. The time taken to execute the program is recorded, so that the speedup associated with a cache hit can easily be seen.

## Setup

You will need to have a [Java 8 or higher JDK](https://openjdk.java.net/) installed, as well as [Apache Maven](https://maven.apache.org/) to build the project.

You will also need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set.

You can then build the project as follows:

```bash
$ ./build.sh
```

If the build succeeds, you should find `rediscachedemo-1.0-jar-with-dependencies.jar` in the `target` directory:

```bash
$ ls target/*.jar
target/rediscachedemo-1.0-jar-with-dependencies.jar
```

## Output

The `run.sh` script executes the code. The first time it runs, you can expect a cache miss:

```bash
$ ./run.sh
Looking in cache for: rates:latest:GBP
Cache miss, fetching from origin...
Caching origin response for 15 seconds at rates:latest:GBP
{"rates":{"CAD":1.7404448041,"HKD":10.6015755819,"ISK":175.3143858939,"PHP":65.7114280256,"DKK":8.3602485868,"HUF":404.8526122967,"CZK":29.4134834744,"GBP":1.0,"RON":5.4757650338,"SEK":11.3935246058,"IDR":19316.3300855219,"INR":100.0297809694,"BRL":7.2900441657,"RUB":100.9023071823,"HRK":8.5190429633,"JPY":142.0945573874,"THB":41.0718901363,"CHF":1.2150635515,"EUR":1.123810166,"MYR":5.5297079217,"BGN":2.1979479226,"TRY":10.1739658137,"CNY":8.8461841026,"NOK":11.6190733061,"NZD":1.9053077554,"ZAR":20.9398424418,"USD":1.3672274479,"MXN":27.1303507412,"SGD":1.8137172269,"AUD":1.7682029152,"ILS":4.2943034063,"KRW":1500.5113336255,"PLN":5.0855781441},"base":"GBP","date":"2021-01-13"}
Time taken: 411 milliseconds.
```

If you run it again within 15 seconds, you'll see a cache hit and should note that the code runs faster as it's not making the origin API call to exchangeratesapi.io:

```bash
$ ./run.sh
Looking in cache for: rates:latest:GBP
Cache hit!
{"rates":{"CAD":1.7404448041,"HKD":10.6015755819,"ISK":175.3143858939,"PHP":65.7114280256,"DKK":8.3602485868,"HUF":404.8526122967,"CZK":29.4134834744,"GBP":1.0,"RON":5.4757650338,"SEK":11.3935246058,"IDR":19316.3300855219,"INR":100.0297809694,"BRL":7.2900441657,"RUB":100.9023071823,"HRK":8.5190429633,"JPY":142.0945573874,"THB":41.0718901363,"CHF":1.2150635515,"EUR":1.123810166,"MYR":5.5297079217,"BGN":2.1979479226,"TRY":10.1739658137,"CNY":8.8461841026,"NOK":11.6190733061,"NZD":1.9053077554,"ZAR":20.9398424418,"USD":1.3672274479,"MXN":27.1303507412,"SGD":1.8137172269,"AUD":1.7682029152,"ILS":4.2943034063,"KRW":1500.5113336255,"PLN":5.0855781441},"base":"GBP","date":"2021-01-13"}
Time taken: 45 milliseconds.
```

Wait 15 or more seconds, and try again... Redis will have expired the cache entry and you'll see the code making a call to the origin API and caching the subsequent response again:

```bash
$ ./run.sh
Looking in cache for: rates:latest:GBP
Cache miss, fetching from origin...
Caching origin response for 15 seconds at rates:latest:GBP
{"rates":{"CAD":1.7404448041,"HKD":10.6015755819,"ISK":175.3143858939,"PHP":65.7114280256,"DKK":8.3602485868,"HUF":404.8526122967,"CZK":29.4134834744,"GBP":1.0,"RON":5.4757650338,"SEK":11.3935246058,"IDR":19316.3300855219,"INR":100.0297809694,"BRL":7.2900441657,"RUB":100.9023071823,"HRK":8.5190429633,"JPY":142.0945573874,"THB":41.0718901363,"CHF":1.2150635515,"EUR":1.123810166,"MYR":5.5297079217,"BGN":2.1979479226,"TRY":10.1739658137,"CNY":8.8461841026,"NOK":11.6190733061,"NZD":1.9053077554,"ZAR":20.9398424418,"USD":1.3672274479,"MXN":27.1303507412,"SGD":1.8137172269,"AUD":1.7682029152,"ILS":4.2943034063,"KRW":1500.5113336255,"PLN":5.0855781441},"base":"GBP","date":"2021-01-13"}
Time taken: 399 milliseconds.
```

You can also use `redis-cli` or [RedisInsight](https://redislabs.com/redis-enterprise/redis-insight/) to see the value stored in Redis.  Here's an example for when there is data in the cache:

```bash
$ redis-cli get rates:latest:GBP
"{\"rates\":{\"CAD\":1.7404448041,\"HKD\":10.6015755819,\"ISK\":175.3143858939,\"PHP\":65.7114280256,\"DKK\":8.3602485868,\"HUF\":404.8526122967,\"CZK\":29.4134834744,\"GBP\":1.0,\"RON\":5.4757650338,\"SEK\":11.3935246058,\"IDR\":19316.3300855219,\"INR\":100.0297809694,\"BRL\":7.2900441657,\"RUB\":100.9023071823,\"HRK\":8.5190429633,\"JPY\":142.0945573874,\"THB\":41.0718901363,\"CHF\":1.2150635515,\"EUR\":1.123810166,\"MYR\":5.5297079217,\"BGN\":2.1979479226,\"TRY\":10.1739658137,\"CNY\":8.8461841026,\"NOK\":11.6190733061,\"NZD\":1.9053077554,\"ZAR\":20.9398424418,\"USD\":1.3672274479,\"MXN\":27.1303507412,\"SGD\":1.8137172269,\"AUD\":1.7682029152,\"ILS\":4.2943034063,\"KRW\":1500.5113336255,\"PLN\":5.0855781441},\"base\":\"GBP\",\"date\":\"2021-01-13\"}"
```

and here's now to see what the remaining time to live in seconds is before Redis expires the data:

```bash
$ redis-cli ttl rates:latest:GBP
(integer) 3
```

In this case, data hasn't been cached yet or has expired:

```bash
$ redis-cli get rates:latest:GBP
(nil)
```
