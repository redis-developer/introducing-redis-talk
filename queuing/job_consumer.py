import random
import redis
import time

LIST_KEY = "jobs"

r = redis.Redis(decode_responses = True)

while True:
    print("Checking for jobs...")

    job = r.brpop(LIST_KEY, timeout = 5)

    if job is None:
        print("Nothing to do right now.")
        time.sleep(5)
    else:
        print("Performing job:")
        print(job)
        time.sleep(random.randint(3, 10))