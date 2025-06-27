---
title: "Database Setup and Configuration"
type: task
status: active
created: 2025-01-05T12:41:19
updated: 2025-01-05T12:41:19
id: TASK-001
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [database, postgresql, firebase, hybrid, setup, critical]
---

# Database Setup and Configuration (Hybrid Architecture)

## Description

Set up the hybrid database architecture using PostgreSQL for relational data and Firebase for file storage. The backend is already configured for this setup with TypeORM entities and Firebase storage integration. This is the most critical task as the application cannot function without proper database connectivity.

## Objectives

1. Install and configure PostgreSQL database for relational data
2. Create database and user for HeartyMeals application  
3. Configure environment variables for PostgreSQL connection
4. Set up Firebase service account for file storage (optional)
5. Run database migrations to create schema (12+ migrations available)
6. Verify hybrid database connectivity and schema creation
7. Plan custom authentication system (replace non-functional OAuth)

## Steps

### 1. PostgreSQL Installation and Setup
- [ ] Install PostgreSQL 14+ (via Docker or local installation)
- [ ] Create database named `HF_Nutrition`
- [ ] Create database user with appropriate permissions
- [ ] Configure PostgreSQL to accept connections

### 2. Environment Configuration
- [ ] Copy `backend/.env copy` to `backend/.env`
- [ ] Update `POSTGRES_URL` with correct connection string
- [ ] Configure Firebase credentials (optional - for file storage)
- [ ] Set `SAVE_FIREBASE=false` to use local storage initially
- [ ] Ensure database credentials are properly configured
- [ ] Test connection string format

### 3. Database Migration
- [ ] Navigate to backend directory
- [ ] Run `npm install` to install dependencies
- [ ] Build the application: `npm run build`
- [ ] Run migrations: `npm run migration:run`
- [ ] Verify all 12 migrations executed successfully

### 4. Connection Verification
- [ ] Start the backend application
- [ ] Verify database connection in application logs
- [ ] Check that all tables are created correctly
- [ ] Verify seeding data is populated (countries, ethnicities, etc.)

### 5. Authentication System Planning
- [ ] Remove/disable current OAuth dependencies
- [ ] Plan JWT-based custom authentication flow
- [ ] Design user registration/login endpoints
- [ ] Update authentication guards and strategies

## Progress

- [x] PostgreSQL installed and running
- [x] Database and user created  
- [x] Environment variables configured
- [x] Migrations executed successfully (12/12 migrations completed)
- [x] Database schema created (18 tables)
- [ ] Application connects to database (testing in progress)
- [ ] Basic seed data populated
- [x] Authentication system requirements documented

## Dependencies

None - this is the foundational task that other tasks depend on.

## Notes

### Why Hybrid Architecture?
Your backend is already optimized for this setup:
- **PostgreSQL**: Handles complex relational data (users, recipes, meal logging, analytics)
- **Firebase**: Handles file storage (recipe images, profile pictures, documents)
- **JSONB columns**: Provide NoSQL flexibility within PostgreSQL for nutrition settings

### Connection String Format
```
postgresql://username:password@host:port/database
Example: postgresql://postgres:admin123@localhost:5432/HF_Nutrition
```

### Docker Alternative
If using Docker for PostgreSQL:
```bash
docker run --name heartymeals-postgres \
  -e POSTGRES_DB=HF_Nutrition \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  -d postgres:14
```

### Firebase Configuration (Optional)
To enable file storage, set these environment variables:
```
SAVE_FIREBASE=true
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_STORAGE_BUCKET=your-bucket-name
```

### Migration Verification
After running migrations, the following tables should exist:
- user, country, ethnicity, dietary
- recipe, component, recipe_component
- meal_logging, meal_log_summary, fluid_logging
- storage, educational_content, user_allergy
- recipe_of_the_day, food_category

## Next Steps

Once database is set up:
1. Create TASK-002: Implement custom authentication system
2. Create TASK-003: Create comprehensive mock data
3. Test authentication endpoints with database
4. Test basic API endpoints with database connectivity

## Authentication Requirements

### Current Issues:
- OAuth flow with `accounts.greensheart.com` is non-functional
- No permissions to access existing OAuth system
- Need custom authentication solution

### Proposed Solution:
- JWT-based authentication
- Custom registration/login endpoints
- Email/password authentication
- Role-based access control (admin/user)
- Session management 