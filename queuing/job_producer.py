import json
import random
import redis
import time

LIST_KEY = "jobs"

JOBS = [
    "Cleaning",
    "Room Service",
    "Taxi",
    "Extra Towels",
    "Extra Pillows"
]

r = redis.Redis(decode_responses = True)

r.delete(LIST_KEY)

while True:
    job = {
        "room": random.randint(100, 500),
        "job": random.choice(JOBS)
    }

    payload = json.dumps(job)
    list_length = r.lpush(LIST_KEY, payload)

    print("Added:")
    print(payload)
    print(f"Queue length is {list_length}")
    time.sleep(random.randint(1, 5))
