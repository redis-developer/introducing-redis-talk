# Queuing

This demo shows how to use a Redis List as a queue, using hotel management tasks as example data. There are two Python scripts:

* `job_producer.py` - adds random jobs to a list at random times.
* `job_consumer.py` - takes the next job from the list, spends a random time "doing it" then gets the next job. Will wait for more jobs if there are none.

Jobs are represented as JSON objects, for example here's a cleaning request for room 436:

```json
{
  "room": 436, 
  "job": "Cleaning"
}
```

## Setup

Create a Python virtual environment and install the dependencies:

```bash
$ python3 -m venv venv
$ . venv/bin/activate
(venv) simon:queuing simon$ pip install -r requirements.txt
Collecting redis==3.5.3 (from -r requirements.txt (line 1))
  Using cached https://files.pythonhosted.org/packages/a7/7c/24fb0511df653cf1a5d938d8f5d19802a88cef255706fdda242ff97e91b7/redis-3.5.3-py2.py3-none-any.whl
Installing collected packages: redis
Successfully installed redis-3.5.3
```

You will also need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set.

## Output

Run the job producer that adds new jobs to the list:

```bash
$ python job_producer.py
Added:
{"room": 169, "job": "Cleaning"}
Queue length is 1
Added:
{"room": 428, "job": "Room Service"}
Queue length is 2
Added:
{"room": 321, "job": "Extra Towels"}
Queue length is 3
Added:
{"room": 200, "job": "Extra Pillows"}
Queue length is 4
Added:
{"room": 246, "job": "Extra Towels"}
Queue length is 5
...
```

Run the job consumer which pops jobs off of the list and spends time "doing" them:

```
$ python job_consumer.py
Checking for jobs...
Performing job Cleaning for room 169. Backlog 4 jobs.
Checking for jobs...
Performing job Room Service for room 428. Backlog 3 jobs.
Checking for jobs...
Performing job Extra Towels for room 321. Backlog 2 jobs.
Checking for jobs...
Performing job Extra Pillows for room 200. Backlog 1 jobs.
Checking for jobs...
Performing job Extra Towels for room 246. Backlog 0 jobs.
Checking for jobs...
Nothing to do right now.
```

If you notice that a backlog of jobs is building up, you can start another instance of the consumer script to help out :). Don't forget that you'll need to activate the Python virtual environment for each new terminal session you use.

If you want to monitor the queue using redis-cli or [RedisInsight](https://redislabs.com/redis-enterprise/redis-insight/), look at the key `jobs`.  Example using redis-cli:

```bash
$ redis-cli
127.0.0.1:6379> llen jobs
(integer) 4
127.0.0.1:6379> lrange jobs 0 -1
1) "{\"room\": 477, \"job\": \"Cleaning\"}"
2) "{\"room\": 146, \"job\": \"Taxi\"}"
3) "{\"room\": 239, \"job\": \"Extra Pillows\"}"
4) "{\"room\": 208, \"job\": \"Extra Pillows\"}"
```

Note that the key `jobs` won't exist if there is no job backlog, as popping the last item off the list deletes the key.
