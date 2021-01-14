from redisearch import Client

client = Client("adoptables")

def find_by_name():
    return client.search("Luna")

def find_dogs_in_age_range():
    return client.search("@species:{dog} @age:[9 15]")

def find_cats_good_with_children():
    return client.search("@species:{cat} @children:{y} @description:(-anxious -nervous)")

def find_male_dogs_within_radius():
    return client.search("@species:{dog} @sex:{m} @location:[-2.2297829,53.0220219 50 mi]")

matching_pets = find_by_name()
print(f"{matching_pets.total} matches.")

for matching_pet in matching_pets.docs:
    print("")
    print(f"{matching_pet.name}, {matching_pet.species}, {matching_pet.age} years old: {matching_pet.description}")
