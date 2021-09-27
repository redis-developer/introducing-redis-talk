# Basics - Redis Strings

This demo shows basic CRUD for storing String values in Redis, with Python example code.

## Setup

Create a Python virtual environment and install the dependencies:

```bash
$ python3 -m venv venv
$ . venv/bin/activate
$ pip install -r requirements.txt
Collecting redis==3.5.3
  Using cached redis-3.5.3-py2.py3-none-any.whl (72 kB)
Installing collected packages: redis
Successfully installed redis-3.5.3
```

You will also need to [install Redis](https://redis.io/download) and have it running locally on the default port 6379 with no password set.  If you have Docker, see the instructions in the main [README](../) - I've provided a Docker Compose file that will start a container with Redis for you.

## Output

Run the example code:

```bash
$ python string_basics.py
EXISTS: 0
EXISTS: 1
GET: Simon Prickett
GET: Arianna Vasquez
DEL: 1
EXISTS: 0
```
