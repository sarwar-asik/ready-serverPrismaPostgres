# 🗺️ Ready Backend

A robust backend service for managing geographical points of interest with authentication, rate limiting, and comprehensive API documentation.

## 🚀 Overview

Ready Backend is a TypeScript-based Express.js application that provides a secure and scalable API for managing geographical locations and points of interest. It uses Prisma as an ORM and implements various security features and optimizations.

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Authentication:** JWT, Cookie-based
- **Security:** 
  - Rate Limiting
  - CORS
  - Compression
  - Cookie Parser
- **Development Tools:**
  - ESLint
  - Prettier
  - Husky (Git Hooks)
  - ts-node-dev

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Secure cookie handling
  - Role-based access control

- **API Security**
  - Rate limiting to prevent abuse
  - CORS configuration
  - Request compression
  - Error handling middleware

- **Development Features**
  - Hot reloading
  - TypeScript support
  - Code formatting and linting
  - Git hooks for code quality

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env

#------Server
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

#------Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

#------Mail sending
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password


```

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd map-points-backend
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
yarn dev
# or
npm run dev
```

## 📝 Available Scripts

- `yarn start`: Start production server
- `yarn dev`: Start development server with hot reloading
- `yarn build`: Build the TypeScript project
- `yarn lint:check`: Check for linting issues
- `yarn lint:fix`: Fix linting issues
- `yarn prettier:check`: Check code formatting
- `yarn prettier:fix`: Fix code formatting
- `yarn lint-prettier`: Run both lint and prettier checks

## 🔒 API Security Features

- Rate limiting configuration to prevent abuse
- CORS setup for development and production
- Request compression for better performance
- Secure cookie handling
- Global error handling middleware

## 🔄 CI/CD with GitHub Actions

This project uses GitHub Actions for continuous integration and deployment. Our workflow automatically:

- Builds the application
- Runs tests
- Checks code quality
- Deploys to production (when merging to main branch)

### Example Workflow Run:

![GitHub Actions Workflow](logs/git-actions.png)

### Workflow Features:

- Automatic builds on push and pull requests
- Node.js environment setup
- Dependency caching for faster builds
- Environment variable handling
- Deployment automation

To view detailed workflow configurations, check `.github/workflows/build-deploy.yml`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Authors

- [Sarwar Hossin](https://github.com/sarwar-asik)

## 🙏 Acknowledgments

- Express.js community
- Prisma team
- TypeScript team
