# 🚀 Notification Service

A robust, scalable Node.js/Express-based push notification service with Firebase Cloud Messaging (FCM) integration, PostgreSQL database, and Docker support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Database Management](#database-management)
- [Docker Deployment](#docker-deployment)
- [Project Architecture](#project-architecture)

## 📝 Overview

The Notification Service is a REST API that manages push notifications across multiple platforms (iOS, Android, Web). It provides device registration, notification sending, and notification logging capabilities using Firebase Cloud Messaging as the delivery mechanism and PostgreSQL for data persistence.

## ✨ Features

- **Multi-Platform Support**: Send notifications to iOS, Android, and Web platforms
- **Device Management**: Register, track, and manage device tokens
- **Batch Notifications**: Send notifications to all registered devices at once
- **Single Device Notifications**: Target specific devices by device ID
- **Image Support**: Include images in push notifications with platform-specific optimizations
- **Notification Logging**: Track all sent notifications with delivery status
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **API Key Authentication**: Secure endpoints with API key middleware
- **Error Handling**: Comprehensive error handling and validation
- **Request Logging**: Morgan-based HTTP request logging
- **Security**: Helmet.js for HTTP security headers, CORS support

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js 5.x |
| **Language** | TypeScript 5.x |
| **Database** | PostgreSQL 18 |
| **ORM** | Drizzle ORM |
| **Push Service** | Firebase Cloud Messaging (FCM) |
| **Validation** | Zod |
| **Security** | Helmet.js, CORS, express-rate-limit |
| **Containerization** | Docker, Docker Compose |
| **Development** | ts-node-dev, Nodemon |

## 📁 Project Structure

```
notification-service/
├── src/
│   ├── app.ts                      # Express app setup and middleware
│   ├── controllers/
│   │   ├── deviceController.ts     # Device management handlers
│   │   └── ValidationSchemas.ts    # Zod validation schemas
│   ├── services/
│   │   ├── deviceService.ts        # Device registration & token management
│   │   └── notificationService.ts  # FCM notification sending logic
│   ├── routes/
│   │   └── notificationRoutes.ts   # API route definitions
│   ├── middleware/
│   │   ├── apiKey.ts              # API key authentication
│   │   ├── errorHandler.ts        # Global error handling
│   │   ├── logger.ts              # Request logging
│   │   └── rateLimiter.ts         # Rate limiting configuration
│   ├── db/
│   │   ├── index.ts               # Database connection
│   │   └── schema.ts              # Database schema definitions
│   └── firebase/
│       ├── firebase.ts            # Firebase initialization
│       └── serviceAccountKey.json # Firebase credentials
├── dist/                           # Compiled JavaScript (generated)
├── Dockerfile                      # Multi-stage Docker build configuration
├── docker-compose.yml              # Docker Compose setup
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── .env                           # Environment variables (local)
└── drizzle.config.ts              # Drizzle ORM configuration
```

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **PostgreSQL** 12+ (for local development) OR **Docker** for containerized setup
- **Firebase Project** with service account credentials

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Generate a service account key (Project Settings → Service Accounts → Generate new private key)
4. Download the JSON file and place it at `src/firebase/serviceAccountKey.json`

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd notification-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=postgres://postgres:admin@localhost:4000/notifications
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_DB=notifications
POSTGRES_PORT=4000
POSTGRES_HOST=localhost

# Firebase Configuration
FIREBASE_CONFIG_PATH=./src/firebase/serviceAccountKey.json

# API Authentication
API_KEY=your-secret-api-key
```

### 4. Setup Firebase Credentials

1. Place your Firebase service account JSON file at `src/firebase/serviceAccountKey.json`

## 🚀 Running the Service

### Development Mode

```bash
npm run start:dev
```

This starts the server with hot-reload using `ts-node-dev`. The service will run on `http://localhost:5000`.

### Production Mode

```bash
npm run build
npm start
```

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will:
- Build the Docker image
- Start the Node.js service on port 5000
- Start PostgreSQL on port 4000
- Automatically set up the database

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1/notifications` and require the `API-Key` header.

### Register Device Token

```http
POST /api/v1/notifications/register-token
Content-Type: application/json
API-Key: your-api-key

{
  "deviceId": "unique-device-identifier",
  "token": "firebase-device-token",
  "deviceInfo": {
    "platform": "ios|android|web",
    "model": "iPhone 14 Pro",
    "brand": "Apple",
    "version": "17.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device token registered successfully",
  "deviceId": "unique-device-identifier"
}
```

### Send Notification to Specific Device

```http
POST /api/v1/notifications/send-notification
Content-Type: application/json
API-Key: your-api-key

{
  "deviceId": "unique-device-identifier",
  "title": "Hello",
  "body": "This is a test notification",
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "imageUrl": "https://example.com/image.png" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "messageId": "message-id-from-fcm"
}
```

### Send Notification to All Devices

```http
POST /api/v1/notifications/send-notification-all
Content-Type: application/json
API-Key: your-api-key

{
  "title": "Important Update",
  "body": "New features are now available",
  "data": {
    "action": "update"
  },
  "imageUrl": "https://example.com/image.png" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "successCount": 150,
  "failureCount": 5,
  "totalDevices": 155
}
```

### Get All Registered Devices

```http
GET /api/v1/notifications/devices
API-Key: your-api-key
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "devices": [
    {
      "id": 1,
      "deviceId": "device-123",
      "token": "firebase-token",
      "platform": "ios",
      "model": "iPhone 14",
      "brand": "Apple",
      "version": "17.0",
      "registeredAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Remove Device Token

```http
PATCH /api/v1/notifications/remove-token/:deviceId
API-Key: your-api-key
```

**Response:**
```json
{
  "success": true,
  "message": "Device token removed successfully"
}
```

## 🗄 Database Management

### Generate Database Migrations

```bash
npm run db:generate
```

### Apply Migrations to Database

```bash
npm run db:push
```

### Run Database Migrations

```bash
npm run db:migrate
```

### Open Drizzle Studio (Web UI)

```bash
npm run db:studio
```

Access it at `http://localhost:3001`

### Reset Database (⚠️ Deletes all data)

```bash
npm run db:reset
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t notification-service:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f app
```

### Stop Services

```bash
docker-compose down
```

### Docker Environment Variables

The `docker-compose.yml` automatically passes environment variables from `.env` to the containers:

```yaml
environment:
  - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@pg_db:5432/${POSTGRES_DB}
  - PORT=${PORT}
  - FIREBASE_CONFIG_PATH=${FIREBASE_CONFIG_PATH}
  - API_KEY=${API_KEY}
```

## 🏗 Project Architecture

### Request Flow

```
Request
  ↓
API Key Middleware (Authentication)
  ↓
Rate Limiter (Protection)
  ↓
Request Logger (Logging)
  ↓
Route Handler
  ↓
Controller (Validation)
  ↓
Service Layer (Business Logic)
  ↓
Database/Firebase
  ↓
Response
```

### Database Schema

#### Devices Table
- `id`: Primary key
- `deviceId`: Unique device identifier
- `token`: Firebase device token
- `platform`: Device platform (ios, android, web)
- `model`: Device model
- `brand`: Device brand
- `version`: OS version
- `registeredAt`: Registration timestamp

#### Notification Logs Table
- `id`: Primary key
- `deviceId`: Reference to device
- `title`: Notification title
- `body`: Notification body
- `data`: Additional JSON data
- `status`: Notification status (queued, sending, sent, failed)
- `messageId`: FCM message ID
- `createdAt`: Creation timestamp

## 🔒 Security Features

- **API Key Authentication**: All endpoints require a valid API key in the header
- **Rate Limiting**: Prevents abuse with configurable request limits
- **Helmet.js**: Sets HTTP security headers
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Zod schemas validate all incoming data
- **Error Handling**: Prevents information leakage in error responses

## 🧪 Testing

### Run in Development

```bash
npm run start:dev
```

### Build TypeScript

```bash
npm run build
```

### Production Start

```bash
npm start
```

## 📚 Key Middleware

- **apiKey.ts**: Validates API key header on protected routes
- **errorHandler.ts**: Centralized error handling middleware
- **logger.ts**: Custom HTTP request logging
- **rateLimiter.ts**: Rate limiting configuration

## 🔄 Workflow Example

1. Client registers a device with a Firebase token
2. Token is stored in PostgreSQL with device metadata
3. To send a notification, provide the device ID and message
4. Service retrieves the token from database
5. FCM is called with the notification payload
6. Notification is sent to the device
7. Status is logged in the database

## 📧 Error Handling

The service returns appropriate HTTP status codes and error messages:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid input or validation failure
- `401 Unauthorized`: Missing or invalid API key
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Happy Notifying! 🎉**
