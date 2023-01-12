import json
import os
import random
import redis
import time
from dotenv import load_dotenv

LIST_KEY = "jobs"

JOBS = [
    "Cleaning",
    "Room Service",
    "Taxi",
    "Extra Towels",
    "Extra Pillows"
]

load_dotenv()

r = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"), decode_responses = True)

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
    time.sleep(random.randint(1, 8))
