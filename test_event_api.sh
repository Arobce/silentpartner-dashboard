#!/bin/bash

# Test 1: Missing required fields
echo "Test 1: Missing required fields"
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

echo -e "\n---\n"

# Test 2: Missing eventName
echo "Test 2: Missing eventName"
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Inc",
    "category": "Hackathon",
    "description": "Test hackathon",
    "date": "2025-12-25T14:00:00",
    "location": "San Francisco",
    "hostId": "test-host-id"
  }' | jq .

echo -e "\n---\n"

# Test 3: Valid event creation
echo "Test 3: Valid event creation"
curl -s -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Tech Hackathon 2025",
    "companyName": "Acme Inc",
    "category": "Hackathon",
    "description": "A 24-hour hackathon for developers",
    "date": "2025-12-25",
    "time": "14:00",
    "isOnline": false,
    "location": "San Francisco Convention Center",
    "capacity": 500,
    "price": 0,
    "hostId": "test-host-id"
  }' | jq .

