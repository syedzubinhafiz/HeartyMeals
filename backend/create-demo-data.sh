#!/bin/bash

echo "🌱 Creating HeartyMeals Demo Data..."

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 5

BASE_URL="http://localhost:3001"

echo "👤 Creating Admin User..."
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User", 
    "email": "admin@heartymeals.com",
    "password": "Admin123!",
    "gender": "Male",
    "age": 35,
    "height": 175,
    "weight": 70,
    "userRole": "Admin"
  }'

echo -e "\n👤 Creating Patient User..."
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Demo",
    "email": "patient1@demo.com", 
    "password": "Patient123!",
    "gender": "Male",
    "age": 65,
    "height": 180,
    "weight": 85,
    "userRole": "Patient"
  }'

echo -e "\n👤 Creating Dietitian User..."
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Dr. Sarah",
    "lastName": "Nutrition",
    "email": "dietitian@heartymeals.com",
    "password": "Dietitian123!",
    "gender": "Female", 
    "age": 42,
    "height": 165,
    "weight": 60,
    "userRole": "Dietitian"
  }'

echo -e "\n✅ Demo data creation completed!"
echo ""
echo "📊 Demo Account Summary:"
echo "Admin: admin@heartymeals.com / Admin123!"
echo "Patient: patient1@demo.com / Patient123!" 
echo "Dietitian: dietitian@heartymeals.com / Dietitian123!"
echo ""
echo "🚀 You can now test the authentication system!" 