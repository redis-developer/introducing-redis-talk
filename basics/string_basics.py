import redis

KEY_NAME = "occupant:101"

r = redis.Redis(decode_responses = True)

print(f"EXISTS: {r.exists(KEY_NAME)}")
r.set(KEY_NAME, "Simon Prickett")
print(f"EXISTS: {r.exists(KEY_NAME)}")
print(f"GET: {r.get(KEY_NAME)}")
r.set(KEY_NAME, "Arianna Vasquez")
print(f"GET: {r.get(KEY_NAME)}")
print(f"DEL: {r.delete(KEY_NAME)}")
print(f"EXISTS: {r.exists(KEY_NAME)}")







