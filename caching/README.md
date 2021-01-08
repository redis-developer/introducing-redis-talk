# Caching

This demo shows how to cache the response from a call to an external API using Redis.  It fetches currency exchange rate information for a given day from [https://exchangeratesapi.io/](https://exchangeratesapi.io/) and caches it in Redis as a String value for 15 seconds.

When the code is run, it will first look in Redis to see if there is a cached response, returning that if so. If there isn't, it will fetch the data from the origin API, store it in Redis, set the expiry time to 15 seconds and return the data. The time taken to execute the program is recorded, so that the speedup associated with a cache hit can easily be seen.

## Setup

You will need to have a [Java 8 or higher JDK](https://openjdk.java.net/) installed, as well as [Apache Maven](https://maven.apache.org/) to build the project.

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
Looking in cache for: rates:2020-11-10:GBP
Cache miss, fetching from origin...
Caching origin response for 15 seconds at rates:2020-11-10:GBP
{"rates":{"CAD":1.7260015922,"HKD":10.2674276488,"ISK":181.9853559535,"PHP":63.969590617,"DKK":8.3474428983,"HUF":400.7041700773,"CZK":29.636814191,"GBP":1.0,"RON":5.4569817118,"SEK":11.4371573058,"IDR":18602.4690804301,"INR":98.2995638182,"BRL":7.1272551944,"RUB":101.1736541718,"HRK":8.4797551103,"JPY":139.4436159358,"THB":40.1702118117,"CHF":1.2128993194,"EUR":1.1212899319,"MYR":5.4556361638,"BGN":2.1930188489,"TRY":10.9521994102,"CNY":8.7580592714,"NOK":11.9549689963,"NZD":1.9402800982,"ZAR":20.576455154,"USD":1.3240191516,"MXN":27.0235358757,"SGD":1.7857663456,"AUD":1.8206384625,"ILS":4.4721527645,"KRW":1478.9029299306,"PLN":5.0446834038},"base":"GBP","date":"2020-11-10"}
Time taken: 522 milliseconds.
```

If you run it again within 15 seconds, you'll see a cache hit and should note that the code runs faster as it's not making the origin API call to exchangeratesapi.io:

```bash
$ ./run.sh
Looking in cache for: rates:2020-11-10:GBP
Cache hit!
{"rates":{"CAD":1.7260015922,"HKD":10.2674276488,"ISK":181.9853559535,"PHP":63.969590617,"DKK":8.3474428983,"HUF":400.7041700773,"CZK":29.636814191,"GBP":1.0,"RON":5.4569817118,"SEK":11.4371573058,"IDR":18602.4690804301,"INR":98.2995638182,"BRL":7.1272551944,"RUB":101.1736541718,"HRK":8.4797551103,"JPY":139.4436159358,"THB":40.1702118117,"CHF":1.2128993194,"EUR":1.1212899319,"MYR":5.4556361638,"BGN":2.1930188489,"TRY":10.9521994102,"CNY":8.7580592714,"NOK":11.9549689963,"NZD":1.9402800982,"ZAR":20.576455154,"USD":1.3240191516,"MXN":27.0235358757,"SGD":1.7857663456,"AUD":1.8206384625,"ILS":4.4721527645,"KRW":1478.9029299306,"PLN":5.0446834038},"base":"GBP","date":"2020-11-10"}
Time taken: 56 milliseconds.
```

Wait 15 or more seconds, and try again... Redis will have expired the cache entry and you'll see the code making a call to the origin API and caching the subsequent response again:

```bash
$ ./run.sh
Looking in cache for: rates:2020-11-10:GBP
Cache miss, fetching from origin...
Caching origin response for 15 seconds at rates:2020-11-10:GBP
{"rates":{"CAD":1.7260015922,"HKD":10.2674276488,"ISK":181.9853559535,"PHP":63.969590617,"DKK":8.3474428983,"HUF":400.7041700773,"CZK":29.636814191,"GBP":1.0,"RON":5.4569817118,"SEK":11.4371573058,"IDR":18602.4690804301,"INR":98.2995638182,"BRL":7.1272551944,"RUB":101.1736541718,"HRK":8.4797551103,"JPY":139.4436159358,"THB":40.1702118117,"CHF":1.2128993194,"EUR":1.1212899319,"MYR":5.4556361638,"BGN":2.1930188489,"TRY":10.9521994102,"CNY":8.7580592714,"NOK":11.9549689963,"NZD":1.9402800982,"ZAR":20.576455154,"USD":1.3240191516,"MXN":27.0235358757,"SGD":1.7857663456,"AUD":1.8206384625,"ILS":4.4721527645,"KRW":1478.9029299306,"PLN":5.0446834038},"base":"GBP","date":"2020-11-10"}
Time taken: 513 milliseconds.
```

You can also use `redis-cli` or [RedisInsight](https://redislabs.com/redis-enterprise/redis-insight/) to see the value stored in Redis.  Here's an example for when there is data in the cache:

```bash
$ redis-cli get rates:2020-11-10:GBP
"{\"rates\":{\"CAD\":1.7260015922,\"HKD\":10.2674276488,\"ISK\":181.9853559535,\"PHP\":63.969590617,\"DKK\":8.3474428983,\"HUF\":400.7041700773,\"CZK\":29.636814191,\"GBP\":1.0,\"RON\":5.4569817118,\"SEK\":11.4371573058,\"IDR\":18602.4690804301,\"INR\":98.2995638182,\"BRL\":7.1272551944,\"RUB\":101.1736541718,\"HRK\":8.4797551103,\"JPY\":139.4436159358,\"THB\":40.1702118117,\"CHF\":1.2128993194,\"EUR\":1.1212899319,\"MYR\":5.4556361638,\"BGN\":2.1930188489,\"TRY\":10.9521994102,\"CNY\":8.7580592714,\"NOK\":11.9549689963,\"NZD\":1.9402800982,\"ZAR\":20.576455154,\"USD\":1.3240191516,\"MXN\":27.0235358757,\"SGD\":1.7857663456,\"AUD\":1.8206384625,\"ILS\":4.4721527645,\"KRW\":1478.9029299306,\"PLN\":5.0446834038},\"base\":\"GBP\",\"date\":\"2020-11-10\"}"
```

and here's now to see what the remaining time to live in seconds is before Redis expires the data:

```bash
$ redis-cli ttl rates:2020-11-10:GBP
(integer) 3
```

In this case, data hasn't been cached yet or has expired:

```bash
$ redis-cli get rates:2020-11-10:GBP
(nil)
```
