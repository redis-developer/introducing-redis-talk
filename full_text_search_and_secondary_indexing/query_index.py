from redisearch import Client, Query

client = Client("adoptables")

def find_by_name():
    # FT.SEARCH adoptables Luna
    return client.search("Luna")

def find_dogs_in_age_range():
    # FT.SEARCH adoptables "@species:{dog} @age:[9 15]"
    return client.search("@species:{dog} @age:[9 15]")

def find_cats_good_with_children():
    # FT.SEARCH adoptables "@species:{cat} @children:{y} @description:(-anxious -nervous)"
    return client.search("@species:{cat} @children:{y} @description:(-anxious -nervous)")

def find_male_dogs_within_radius():
    # FT.SEARCH adoptables "@species:{dog} @sex:{m} @location:[-2.2297829,53.0220219 50 mi]"
    return client.search("@species:{dog} @sex:{m} @location:[-2.2297829,53.0220219 50 mi]")

matching_pets = find_cats_good_with_children()
print(f"{matching_pets.total} matches.")

for matching_pet in matching_pets.docs:
    print("")
    print(f"{matching_pet.name}, {matching_pet.species}, {matching_pet.age} years old: {matching_pet.description}")
