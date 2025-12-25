# Stack Overflow Clone - Backend

A modern, production-ready backend API built with Node.js, TypeScript, Express, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Password hashing with bcrypt (10 rounds)
  - Secure token management

- **User Management**
  - User registration and login
  - Profile management
  - Pagination support for user lists

- **Security**
  - Helmet.js for HTTP headers
  - CORS configuration
  - Input validation with class-validator
  - XSS protection
  - Rate limiting ready

- **Code Quality**
  - TypeScript for type safety
  - ESLint + Prettier for code formatting
  - Consistent error handling
  - Request ID tracking
  - Comprehensive logging

- **Database**
  - TypeORM for database management
  - PostgreSQL database
  - Migrations support
  - Connection pooling
  - Automatic timestamps

## 📋 Prerequisites

- Node.js >= 18.x
- Docker & Docker Compose
- Yarn (recommended) or npm

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd stackoverflow-clone/backend
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example dev.env
```

Update `dev.env` with your configuration:

```env
# Server
PORT=4000

# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stackoverflow_db

# JWT (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# PostgreSQL Container (Docker only)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=stackoverflow_db
```

## 🐳 Running with Docker (Recommended)

### Development Mode

```bash
# From project root
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker logs stackoverflow-backend -f
```

### Run Migrations

```bash
docker exec stackoverflow-backend yarn migration:run
```

### Stop Containers

```bash
docker-compose -f docker-compose.dev.yml down
```

### Remove Volumes (Fresh Start)

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## 💻 Running Locally (Without Docker)

### 1. Start PostgreSQL

Make sure PostgreSQL is running on your system.

### 2. Update Environment

Update `dev.env` with local database connection:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stackoverflow_db
```

### 3. Run Migrations

```bash
yarn migration:run
```

### 4. Start Development Server

```bash
yarn dev
```

## 📚 Available Scripts

```bash
# Development
yarn dev              # Start dev server with hot reload
yarn build            # Build for production
yarn start            # Start production server

# Database
yarn migration:run    # Run migrations
yarn migration:revert # Revert last migration
yarn migration:show   # Show migrations status
yarn migration:generate ./src/migrations/MigrationName  # Generate migration

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint errors
yarn format           # Format code with Prettier

# Utilities
yarn typeorm          # TypeORM CLI
```

## 🌐 API Endpoints

### Health Check

```
GET /health
```

Returns server and database status.

### Authentication

#### Register User

```
POST /v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

Password requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### Login

```
POST /v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Users (Protected)

#### Get All Users (with pagination)

```
GET /v1/users?page=1&limit=10
Authorization: Bearer <token>
```

Query parameters:

- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)

#### Get Current User Profile

```
GET /v1/users/me
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── databaseConfig.ts
│   │   └── env.config.ts
│   ├── constants/       # Application constants
│   │   └── index.ts
│   ├── dto/             # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── entities/        # TypeORM entities
│   │   └── User.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── validation.middleware.ts
│   ├── migrations/      # Database migrations
│   ├── routes/          # API routes
│   │   ├── auth/
│   │   └── users/
│   ├── services/        # Business logic
│   │   ├── auth-services/
│   │   └── user/
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── transaction.util.ts
│   │   └── index.ts
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── .env.example         # Example environment file
├── Dockerfile.dev       # Development Dockerfile
├── Dockerfile.prod      # Production Dockerfile
├── package.json
└── tsconfig.json
```

## 💾 Database Transactions

For operations that require multiple database updates to succeed or fail together, use the `withTransaction` utility:

```typescript
import { withTransaction } from '../utils'
import { User } from '../entities/User'
import { Profile } from '../entities/Profile'

// Example: Creating a user and profile atomically
const result = await withTransaction(async (queryRunner) => {
  // Both operations will be committed together or rolled back on error
  const user = await queryRunner.manager.save(User, {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
  })

  const profile = await queryRunner.manager.save(Profile, {
    userId: user.id,
    bio: 'Software Developer',
  })

  return { user, profile }
})
```

**Benefits:**

- Automatic commit on success
- Automatic rollback on error
- Proper connection management
- Type-safe with TypeScript

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, randomly generated secret (min 32 characters)
3. **Password Policy**: Enforced minimum 8 characters with complexity
4. **CORS**: Configure allowed origins in production
5. **Rate Limiting**: Implement for production (recommended)
6. **HTTPS**: Always use HTTPS in production

## 🚧 Production Deployment

### 1. Update Environment

Create `prod.env` with production values:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=<strong-random-secret-min-64-chars>
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### 2. Build Docker Image

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Run Migrations

```bash
docker exec stackoverflow-backend yarn migration:run
```

## 📊 Database Schema

### User Table

- `id` (PRIMARY KEY)
- `name` (VARCHAR 255)
- `email` (VARCHAR 255, UNIQUE, INDEXED)
- `password` (VARCHAR 255, HASHED)
- `googleId` (VARCHAR 255, NULLABLE)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## 🤝 Contributing

1. Follow the existing code style
2. Run linting before committing: `yarn lint:fix`
3. Ensure all tests pass
4. Update documentation as needed
