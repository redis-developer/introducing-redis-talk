import redis
import time

r = redis.Redis(decode_responses = True)

def add_new_adoptable(adoptable_id):
    adoptable_key = f"adoptable:{adoptable_id}"

    pipeline = r.pipeline()
    pipeline.delete(adoptable_key)
    pipeline.hset(adoptable_key, mapping = {
        "name": "Frank",
        "species": "cat",
        "age": "6",
        "weight": "9",
        "location": "-1.0579597,52.9417272",
        "sex": "m",
        "fee": "30",
        "children": "y",
        "other_animals": "y",
        "description": "6 year old Frank is looking for his forever home. A much loved cat, Frank did not settle into indoor life in his previous home and grew frustrated with his change of circumstances."
    })

    pipeline.execute()
    
add_new_adoptable("446")
print("Added new adoptable!")
