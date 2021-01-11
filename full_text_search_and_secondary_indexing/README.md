# Full Text Search and Secondary Indexing

This demo shows how to use the [RediSearch module](https://oss.redislabs.com/redisearch/) to do full text search and secondary indexing over data stored in a number of Redis Hashes.  A Redis Hash is an object-like data structure, it's a set of field name / value pairs stored at a single key in Redis.

Read more about Hashes [here](https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/1-2-what-redis-data-structures-look-like/1-2-4-hashes-in-redis/), or watch a fun video [here](https://www.youtube.com/watch?v=-agsJUihrWw).

In this demo, we're operating an animal rescue organization that rehomes dogs and cats. Each animal that we're taking care of is described by a Redis Hash. We want to allow prospective adopters to search for animals that meet their adoption criteria. For example, someone may want to see all male dogs within 40 miles of their location that are between 4 and 7 years old and good with children. To achieve this, we'll use a RediSearch index.

## Setup

You will need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set. This demo requires the RediSearch module, so you'll also need to [install that](https://oss.redislabs.com/redisearch/). If you want to try this out without installing and configuring Redis, use either of the following options:

* The RediSearch Docker image.
* Redis Labs offers a free 30Mb Redis Enterprise instance with RediSearch installed in the cloud .

Check out the [RediSearch Quick Start](https://oss.redislabs.com/redisearch/Quick_Start/) for more information on the above options.

Once you have Redis and RediSearch set up, you'll need to create a Python virtual environment and install the dependencies:

```bash
$ python3 -m venv venv
full_text_search_and_secondary_indexing $ . venv/bin/activate
(venv) full_text_search_and_secondary_indexing $ pip install -r requirements.txt

Collecting hiredis==1.1.0
  Using cached hiredis-1.1.0-cp38-cp38-macosx_10_9_x86_64.whl (19 kB)
Collecting redis==3.5.3
  Using cached redis-3.5.3-py2.py3-none-any.whl (72 kB)
Collecting redisearch==2.0.0
  Using cached redisearch-2.0.0.tar.gz (2.1 MB)
Collecting rmtest==0.7.0
  Using cached rmtest-0.7.0.tar.gz (6.8 kB)
Collecting six==1.15.0
  Using cached six-1.15.0-py2.py3-none-any.whl (10 kB)
Using legacy 'setup.py install' for redisearch, since package 'wheel' is not installed.
Using legacy 'setup.py install' for rmtest, since package 'wheel' is not installed.
Installing collected packages: hiredis, redis, rmtest, six, redisearch
    Running setup.py install for rmtest ... done
    Running setup.py install for redisearch ... done
Successfully installed hiredis-1.1.0 redis-3.5.3 redisearch-2.0.0 rmtest-0.7.0 six-1.15.0
```

## Creating the Index and Loading Data

The index is called `adoptables` and is created using the `FT.SEARCH` command, which needs to be passed:

* An index name.
* One or more key prefixes - these are the keys that RediSearch will then track changes on for indexing.
* A schema describing which fields in the Hashes to index and how to treat them.

The schema for our adoptable animal hashes looks like this:

Field Name    | RediSearch Type
--------------| ---------------
name          | TEXT SORTABLE
species       | TAG SORTABLE
age           | NUMERIC SORTABLE
weight        | NUMERIC SORTABLE
location      | GEO SORTABLE
sex           | TAG SORTABLE
description   | TEXT SORTABLE
fee           | NUMERIC SORTABLE
children      | TAG SORTABLE
other_animals | TAG SORTABLE

For the full `FT.CREATE` command used, see [`create_index.redis`](create_index.redis).

Create the index and load the example data (contained in [animal_data.redis](animal_data.redis)) by runnign the `load_data.sh` script:

```bash
$ ./load_data.sh
Loading data...
(integer) 10
(integer) 10
(integer) 10
(integer) 10
...
Data loaded, creating index...
(error) Unknown Index name
OK
Index created.
```

Each `(integer) 10` is the output from the `HSET` command when adding an adoptable animal's Hash.  Ignore any `(error) Unknown Index name` output - this is where we delete any old RediSearch index named `adoptables`, and will occur and be ignored in the case where no such index was found.

## Querying the Index with redis-cli

You can query the adoptable animals index from redis-cli.  Once connected to your Redis instance, use the `FT.SEARCH` command.  For example, let's find female cats aged 3-8 that are friendly but don't have "nervous" in the description field:

```bash
127.0.0.1:6379> FT.SEARCH adoptables "@species:{cat} @sex:{f} @age:[3 8] @description:(friendly -nervous)" limit 0 2
1) (integer) 7
2) "adoptable:477"
3)  1) "sex"
    2) "f"
    3) "name"
    4) "Ursula"
    5) "fee"
    6) "40"
    7) "species"
    8) "cat"
    9) "children"
   10) "y"
   11) "weight"
   12) "12"
   13) "other_animals"
   14) "y"
   15) "age"
   16) "5"
   17) "description"
   18) "Pretty girl Ursula is looking for a new furever home due to her owner sadly passing away.  She is a friendly girl who would make a lovely pet."
   19) "location"
   20) "-2.033453,52.4176485"
4) "adoptable:400"
5)  1) "sex"
    2) "f"
    3) "name"
    4) "Chloe"
    5) "fee"
    6) "50"
    7) "species"
    8) "cat"
    9) "children"
   10) "y"
   11) "weight"
   12) "6"
   13) "other_animals"
   14) "y"
   15) "age"
   16) "3"
   17) "description"
   18) "Chloe came into our care suffering from injuries to one of her front legs sustained during a dog attack. After surgery and many weeks of recovery in foster care, she is now looking for a new home. She is a friendly and playful little character who loves human companionship. With careful introductions, she could live with another cat or children of school age."
   19) "location"
   20) "-2.033453,52.4176485"
```

The `FT.SEARCH` command allows for all sorts of full text and faceted searching, ordering, filtering and aggregation. [Check out the documentation](https://oss.redislabs.com/redisearch/Commands/#ftsearch) to see everything it's capable of.

Additionally, if you prefer a more graphical way to look at data in Redis rather than redis-cli, try [RedisInsight](https://redislabs.com/redis-enterprise/redis-insight/).

## Querying the Index with Python

TODO

TODO mention code change that would be needed for a remote Redis...

## Managing Data in the Index

RediSearch automatically tracks changes to Hashes whose key names fit the pattern that it was told to watch when the index was created. 

Adding new data to the index is as simple as creating a new Hashes in Redis using the `HSET` command.  Example code for this can be found in [`add_adoptable.py`](add_adoptable.py).

The code assumes that your Redis instance is on `localhost` at port `6379` which is the default. If you're using a Redis instance that's located elsewhere, or which requires a password, change line 4 from:

```python
r = redis.Redis(decode_responses = True)
```

to something like:

```python
r = redis.Redis(host = "your host", port = 9999, password = "sssssh", decode_responses = True)
```

Make sure to use the correct hostname, port and password to connect to your Redis instance.

# Scratch Pad Section...

Example queries:

ft.search adoptables "@species:{dog} @age:[10 15] @sex:{m} @description:(family -training)" limit 0 1

Example geo query:

ft.search adoptables "@location:[-2.2297829,53.0220219 80 mi]

Search location example:

Stoke on Trent: -2.2297829,53.0220219

Locations:

Nottingham:  -1.0579597,52.9417272
Sheffield:   -1.4357417,53.3881032 
Birmingham:  -2.033453,52.4176485
Leeds:       -1.5442055,53.729469    
