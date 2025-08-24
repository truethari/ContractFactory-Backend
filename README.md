# Contract Factory Backend

A robust Express.js backend API for the Contract Factory platform that provides secure Solidity smart contract compilation and deployment services.

![Backend Status](https://img.shields.io/badge/status-active-brightgreen) ![Express.js](https://img.shields.io/badge/Express.js-4.19.2-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-20+-green)

## ✨ Features

- **🔧 Smart Contract Compilation API** - Secure Solidity compilation with OpenZeppelin support
- **📊 Activity Tracking** - Monitor compilation and deployment activities
- **🛡️ Secure Authentication** - JWT-based authentication system
- **📝 API Documentation** - Complete Swagger/OpenAPI documentation
- **🗄️ Database Integration** - Prisma ORM with PostgreSQL support
- **⚡ Redis Caching** - High-performance caching layer
- **🔒 Security Middleware** - Helmet, CORS, XSS protection, and input sanitization

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/truethari/ContractFactory-Backend.git
   cd ContractFactory-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the required configuration:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/contract_factory"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="your-secret-key"
   NODE_ENV="development"
   PORT=5000
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Access the API**
   - API Base URL: `http://localhost:5000/api/v1`
   - API Documentation: `http://localhost:5000/api-docs`

## 🏗️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run formatting, linting, and build
- `npm run deploy` - Deploy to CapRover

### Project Structure

```
src/
├── api/v1/
│   ├── controllers/        # Request handlers
│   │   ├── activities.controller.ts
│   │   ├── auth.controller.ts
│   │   └── deployments.controller.ts
│   ├── middlewares/        # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── form.middleware.ts
│   │   ├── sanitize.middleware.ts
│   │   └── schema.middleware.ts
│   ├── routes/            # API route definitions
│   │   ├── activities.router.ts
│   │   ├── auth.router.ts
│   │   └── deployments.router.ts
│   └── services/          # Business logic layer
│       ├── activities.service.ts
│       ├── auth.service.ts
│       └── deployments.service.ts
├── config/                # Configuration files
├── lib/                   # Utility libraries
│   ├── cache.ts          # Redis caching
│   ├── jwt.ts            # JWT utilities
│   └── prisma.ts         # Database client
├── schema/                # Validation schemas
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities
```

## 🛠️ API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration

### Smart Contract Operations

- `POST /api/v1/deployments/compile` - Compile Solidity contracts
- `GET /api/v1/deployments` - Get deployment history
- `POST /api/v1/deployments` - Create new deployment

### Activity Tracking

- `GET /api/v1/activities` - Get user activities
- `POST /api/v1/activities` - Log new activity

## 🔧 Built With

- **[Express.js](https://expressjs.com/)** - Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[Redis](https://redis.io/)** - Caching layer
- **[Solc](https://docs.soliditylang.org/en/latest/installing-solidity.html)** - Solidity compiler
- **[OpenZeppelin](https://openzeppelin.com/)** - Smart contract library
- **[JWT](https://jwt.io/)** - Authentication tokens
- **[Helmet](https://helmetjs.github.io/)** - Security middleware

## 🔗 Related Repositories

- **[Contract Factory Frontend](https://github.com/truethari/ContractFactory)** - Next.js frontend application

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Sanitization** - XSS and injection attack prevention
- **Rate Limiting** - API abuse prevention
- **CORS Configuration** - Cross-origin request security
- **Helmet Middleware** - HTTP security headers
- **Environment Variables** - Secure configuration management

## 📚 Database Schema

The backend uses Prisma ORM with the following main entities:

- **Users** - User authentication and profile data
- **Deployments** - Smart contract compilation and deployment records
- **Activities** - User activity tracking and logs

## 🚀 Deployment

The backend is configured for deployment with CapRover:

```bash
npm run deploy
```

Make sure to configure the following environment variables in production:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

## 📞 Support

- **API Documentation** - Available at `/api-docs` endpoint
- **Issues** - [GitHub Issues](https://github.com/truethari/ContractFactory-Backend/issues)
- **Frontend Repository** - [Contract Factory Frontend](https://github.com/truethari/ContractFactory)

---

**Built with ❤️ by the Contract Factory team**
