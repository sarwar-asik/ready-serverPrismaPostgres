# 🗺️ Ready Backend

A advance backend boilerplate with modern secure high demand features

## 🚀 Overview

Ready Backend is a TypeScript-based Express.js application that provides a secure and scalable API. It uses Prisma as an ORM and implements various security features and optimizations.

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
  - CI/CD with GitHub Actions
  - Docker support
  - AWS S3 for file storage
  - Cloudinary for image processing
  - Nodemailer for email sending
  - Swagger for API documentation
  - Sentry for error monitoring
  - Docker Compose for easy local development

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn or pnpm
- PostgreSQL database

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env

#------Server
NODE_ENV=development
PORT=5000
SERVER_NAME="Ready Backend"

#------Database
DATABASE_URL="postgresql://postgres:pass_your@127.0.0.1:5432/ready-backend_db?schema=public"
SHADOW_DATABASE_URL='postgresql://postgres:pass_your@127.0.0.1:5432/ready-backend_db?schema=public'

#----------Security
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=very-refresh-secret
JWT_REFRESH_EXPIRES_IN=365d
SERVER_URL='http://localhost:5001'

#---------Cloudinary
CLOUDINARY_CLOUD_NAME="sadfasdfasd"
CLOUDINARY_API_KEY="234512342314"
CLOUDINARY_API_SECRET="1234342345"

#---------AWS S3
S3_BUCKET="ready-backend"
S3_REGION="ap-southeast-1"
S3_ACCESS_KEY_ID="EXAMPLEKEYID"
S3_SECRET_ACCESS_KEY="EXAMPLE_example"

#---------SMTP
FRONTEND_URL = ""
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

SMTP_HOST='smtp.gmail.com'
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER='sarwarasik@gmail.com'
SMTP_PASS='example example example'


#---------Default Password
SUPER_ADMIN_EMAIL=admin@gmail.com
SUPER_ADMIN_PASSWORD=adminPass



```

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ready-backend
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

## 📁 File Upload Features

The backend supports file uploads with the following features:
- Image upload support for user profiles
- Automatic directory creation for uploads
- File type validation
- Size limits and optimization
- Secure file storage

## 👤 User Management

- Role-based access control (User, Admin, Super Admin)
- Super Admin seeding on first startup
- Profile management with image upload
- Secure password handling
- Email verification

## 🔐 Authentication Features

- JWT-based authentication
- Refresh token support
- Password reset functionality
- Email verification
- Session management
- Rate limiting on auth endpoints

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. Start all services:
```bash
docker-compose up -d
```

2. Stop all services:
```bash
docker-compose down
```

3. View logs:
```bash
docker-compose logs -f api
```

### Manual Docker Build

1. Build the Docker image:
```bash
docker build -t ready-backend .
```

2. Run the container:
```bash
docker run -p 5000:5000 --env-file .env ready-backend
```

### Docker Configuration

The project includes:
- Multi-stage build optimization
- Production-ready Node.js configuration
- PostgreSQL database container
- Volume persistence for database
- Hot-reloading for development
- Automatic container restart
- Network isolation

### Docker Files
- `Dockerfile`: Multi-stage build configuration
- `docker-compose.yml`: Service orchestration
- `.dockerignore`: Build optimization

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

<!-- 
[![autocomplete](https://codeium.com/badges/user/sarwar-asik/autocomplete)](https://codeium.com/profile/sarwar-asik)



[![streak](https://codeium.com/badges/v2/user/sarwar-asik/streak)](https://codeium.com/profile/sarwar-asik) -->