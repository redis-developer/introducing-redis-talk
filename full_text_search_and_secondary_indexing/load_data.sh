#!/bin/bash
echo "Loading data..."
redis-cli < animal_data.redis
echo "Data loaded, creating index..."
redis-cli < create_index.redis
echo "Index created."