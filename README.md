# 🛍️ OoNt Order Tracker

A modern order tracking application built with React (TypeScript) frontend and Node.js/Express backend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Design Decisions](#design-decisions)
- [Bonus Features](#bonus-features)
- [Testing](#testing)
- [Assumptions](#assumptions)

## ✨ Features

### Core Features
- **Order Display**: View a list of orders with product details, amounts, quantities, and status
- **Order Cancellation**: Cancel pending orders with confirmation dialog
- **Status Filtering**: Filter orders by status (All, Pending, Completed, Cancelled) with accurate counts
- **User Filtering**: Filter orders by specific users (Alice Smith, Bob Johnson, Charlie Brown)
- **Combined Filtering**: Filter by both status and user simultaneously
- **Quantity Tracking**: Each order displays quantity information
- **Responsive Design**: Clean, professional UI that works on desktop and mobile
- **Real-time Updates**: Orders update immediately when cancelled

### Enhanced Features
- **Professional Styling**: Modern CSS framework with clean card-based design
- **Smart Filter Counts**: Status filter buttons show accurate counts per selected user
- **Local Persistence**: Orders cached in browser localStorage for offline viewing
- **UUID Generation**: Proper UUID generation for order IDs
- **Advanced Filtering**: Server-side filtering by status and user ID with query parameters
- **Unit Tests**: Comprehensive test suite for backend services
- **Error Handling**: Graceful fallback to cached data when API is unavailable
- **Loading States**: Proper loading indicators and error messages
- **User-Friendly Interface**: Intuitive buttons, clear typography, and responsive layout

### Security Features
- **JWT Authentication**: Complete token-based authentication system
- **Role-Based Access Control**: Admin and user role differentiation
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Security Middleware**: Helmet, rate limiting, and enhanced CORS
- **Protected API Endpoints**: All endpoints require proper authentication
- **Token Verification**: Automatic token validation and user verification
- **Security Headers**: CSP, HSTS, X-Frame-Options via Helmet middleware
- **Rate Limiting**: Authentication-specific and general API rate limiting

## 🛠️ Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **JWT Authentication** with jsonwebtoken
- **Password Hashing** with bcryptjs
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **UUID** for unique ID generation
- **Jest** for unit testing
- **Swagger/OpenAPI** for interactive API documentation
- In-memory data storage (no database required)

### Frontend
- **React 18** with **TypeScript**
- **Axios** for API communication
- **Custom Hooks** for state management
- **Local Storage** for data persistence
- **Modern CSS Framework** with professional styling
- **Responsive Design** with mobile-first approach

## 📁 Project Structure

```
oont-assignment/
├── backend/
│   ├── src/
│   │   ├── types/           # TypeScript type definitions
│   │   ├── services/        # Business logic and data management
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Validation and authentication middleware
│   │   ├── config/          # Configuration files (Swagger, etc.)
│   │   ├── __tests__/       # Unit tests
│   │   └── server.ts        # Express server setup
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── package.json             # Root package.json for scripts
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oont-assignment
   ```

2. **Install dependencies for both backend and frontend**
   ```bash
   npm run install:all
   ```

3. **Start both applications concurrently**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:3001`
   - Frontend React app on `http://localhost:3000`

### Manual Setup

If you prefer to run backend and frontend separately:

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend will be available at `http://localhost:3001`

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

### Build for Production

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```

## 📚 API Endpoints

Base URL: `http://localhost:3001/api`

### 📖 Interactive API Documentation

**Swagger UI is available at: [`http://localhost:3001/api-docs`](http://localhost:3001/api-docs)**

The API includes comprehensive Swagger/OpenAPI 3.0 documentation with:
- **Interactive Testing**: Try out all endpoints directly in the browser
- **Complete Schemas**: Detailed request/response models with examples
- **Parameter Documentation**: Full parameter descriptions and validation rules
- **Live Examples**: Real sample data for all endpoints
- **Error Response Documentation**: Complete error handling examples

### Orders

| Method | Endpoint | Description | Parameters | Authentication |
|--------|----------|-------------|------------|----------------|
| `GET` | `/orders` | Get all orders | Query: `?status=pending&userId=alice.smith` | Required |
| `GET` | `/orders/users` | Get all unique users | - | Required |
| `GET` | `/orders/:id` | Get single order by ID | - | Required |
| `POST` | `/orders` | Create new order | `{ userId, product, quantity, amount }` | Required |
| `PUT` | `/orders/:id/status` | Update order status | `{ status: "pending" \| "completed" \| "cancelled" }` | Required |
| `DELETE` | `/orders/:id` | Delete order | - | Required (Admin only) |

### Health Check

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/health` | API health status | None |

### Query Parameters for `/orders`

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | string | Filter by order status | `?status=pending` |
| `userId` | string | Filter by user ID | `?userId=alice.smith` |
| `combined` | string | Combine both filters | `?status=completed&userId=bob.johnson` |

### Sample API Requests

#### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Create Order with Quantity (Authenticated)
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "userId": "alice.smith",
    "product": "Wireless Headphones",
    "quantity": 2,
    "amount": 299.99
  }'
```

#### Get All Orders (Authenticated)
```bash
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Get All Users (Authenticated)
```bash
curl http://localhost:3001/api/orders/users \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Filter Orders by Status (Authenticated)
```bash
curl http://localhost:3001/api/orders?status=pending \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Filter Orders by User (Authenticated)
```bash
curl http://localhost:3001/api/orders?userId=alice.smith \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Filter Orders by Status and User (Authenticated)
```bash
curl http://localhost:3001/api/orders?status=completed&userId=bob.johnson \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Get Single Order (Authenticated)
```bash
curl http://localhost:3001/api/orders/84c75335-5b07-4921-a4d9-2b9b0efcd5cd \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Cancel Order (Update Status) - Authenticated
```bash
curl -X PUT http://localhost:3001/api/orders/84c75335-5b07-4921-a4d9-2b9b0efcd5cd/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"status": "cancelled"}'
```

#### Delete Order (Admin Only) - Authenticated
```bash
curl -X DELETE http://localhost:3001/api/orders/84c75335-5b07-4921-a4d9-2b9b0efcd5cd \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Response Examples

#### Order Object Structure
```json
{
  "id": "84c75335-5b07-4921-a4d9-2b9b0efcd5cd",
  "userId": "alice.smith",
  "product": "Wireless Headphones",
  "quantity": 2,
  "amount": 299.99,
  "status": "pending",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

#### Get All Orders Response
```json
[
  {
    "id": "84c75335-5b07-4921-a4d9-2b9b0efcd5cd",
    "userId": "alice.smith",
    "product": "Wireless Headphones",
    "quantity": 2,
    "amount": 299.99,
    "status": "pending",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  {
    "id": "1541d1dc-b3a5-42c5-8626-6cc69cfff0bb",
    "userId": "bob.johnson",
    "product": "Gaming Mouse",
    "quantity": 1,
    "amount": 89.99,
    "status": "completed",
    "createdAt": "2025-01-15T09:15:00.000Z",
    "updatedAt": "2025-01-15T11:45:00.000Z"
  }
]
```

#### Get Users Response
```json
["alice.smith", "bob.johnson", "charlie.brown"]
```

#### Error Response
```json
{
  "error": "Order not found",
  "message": "No order found with ID: invalid-id"
}
```

## 🔐 Security

The OoNt Order Tracker implements comprehensive security measures to protect against common web application vulnerabilities and ensure secure access to all API endpoints.

### 🛡️ Security Architecture

#### JWT Authentication System
- **Token-Based Authentication**: Stateless JWT tokens for secure API access
- **24-Hour Token Expiration**: Configurable token lifetime for security balance
- **Automatic Token Verification**: Middleware validates tokens on every protected request
- **User Session Management**: Secure login/logout with token invalidation

#### Role-Based Access Control (RBAC)
- **User Roles**: `admin` and `user` roles with different permissions
- **Endpoint Protection**: Granular access control per API endpoint
- **Admin Privileges**: Admin-only endpoints for sensitive operations
- **Ownership Validation**: Users can only access their own data (admin bypass available)

#### Password Security
- **bcrypt Hashing**: Industry-standard password hashing with 12 salt rounds
- **Secure Password Storage**: Never store plain text passwords
- **Password Validation**: Strong password requirements enforced
- **Secure Authentication**: Constant-time password comparison

### 🔒 Security Middleware Stack

#### Helmet Security Headers
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### Rate Limiting Protection
- **General API Limiting**: 100 requests per 15 minutes per IP
- **Authentication Limiting**: 5 login attempts per 15 minutes per IP
- **Brute Force Protection**: Prevents automated attacks
- **DDoS Mitigation**: Basic protection against denial-of-service

#### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### 🔑 Authentication Flow

#### 1. User Registration
```typescript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### 2. User Login
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### 3. Authenticated Requests
Include JWT token in Authorization header:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🧪 Test User Credentials

For development and testing purposes, you can create users or use these examples:

#### Admin User
```json
{
  "email": "admin@oont.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

#### Regular User
```json
{
  "email": "user@oont.com",
  "password": "user123",
  "firstName": "Test",
  "lastName": "User",
  "role": "user"
}
```

### 🛠️ Security Implementation Details

#### Authentication Middleware
```typescript
// JWT token verification
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction)

// Role-based access control
export const requireRole = (allowedRoles: UserRole[])

// Data ownership validation
export const requireOwnership = (req: AuthenticatedRequest, res: Response, next: NextFunction)
```

#### Protected Endpoints
All API endpoints except `/health` and authentication routes require valid JWT tokens:

- ✅ **Public**: `/health`, `/auth/register`, `/auth/login`
- 🔒 **User**: All `/orders` endpoints (with ownership validation)
- 👑 **Admin**: `DELETE /orders/:id`, user management functions

#### Security Validations
- **Input Sanitization**: All user inputs validated and sanitized
- **SQL Injection Prevention**: Using parameterized queries (when applicable)
- **XSS Protection**: Content Security Policy and input validation
- **CSRF Protection**: Token-based authentication prevents CSRF attacks

### 🌐 Production Security Considerations

#### Environment Variables
```bash
# Required for production
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=24h
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production

# Optional security enhancements
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

#### Security Best Practices Implemented
1. **Secure Headers**: Comprehensive security headers via Helmet
2. **Rate Limiting**: Multiple layers of rate limiting protection
3. **Input Validation**: Comprehensive validation on all inputs
4. **Error Handling**: Secure error messages without information leakage
5. **Token Security**: Secure JWT implementation with proper expiration
6. **Password Security**: Industry-standard bcrypt hashing
7. **CORS Policy**: Restrictive CORS configuration for production
8. **Content Security Policy**: XSS protection via CSP headers

#### Security Audit Results
✅ **Authentication**: Complete JWT-based authentication system
✅ **Authorization**: Role-based access control implemented
✅ **Input Validation**: Comprehensive validation on all endpoints
✅ **Security Headers**: Full Helmet protection enabled
✅ **Rate Limiting**: Multi-tier rate limiting protection
✅ **Password Security**: bcrypt with 12 salt rounds
✅ **CORS Configuration**: Properly configured for production
✅ **Error Handling**: Secure error responses without data leakage

### 🚨 Security Monitoring

#### Logging and Monitoring
- **Authentication Events**: Login/logout events logged
- **Failed Attempts**: Brute force attempts tracked
- **Rate Limit Violations**: Suspicious activity detection
- **Error Tracking**: Security-related errors monitored

#### Security Testing
```bash
# Run security tests
cd backend
npm test -- --testPathPattern=security

# Audit dependencies for vulnerabilities
npm audit

# Check for outdated packages
npm outdated
```

## 🎯 Design Decisions

### Backend Architecture
- **Layered Architecture**: Separated concerns with routes, services, and middleware
- **TypeScript**: Full type safety and better developer experience
- **In-Memory Storage**: Simple Map-based storage as per requirements
- **Express Middleware**: Comprehensive validation and error handling
- **UUID Generation**: Proper unique identifiers instead of simple counters

### Frontend Architecture
- **Component-Based**: Modular, reusable React components
- **Custom Hooks**: Centralized state management with `useOrders` hook
- **Service Layer**: Separate API logic from component logic
- **TypeScript**: Shared type definitions between frontend and backend
- **Graceful Degradation**: Fallback to cached data when API is unavailable

### UI/UX Decisions
- **Card-Based Layout**: Clean, modern design with clear visual hierarchy
- **Status Badges**: Color-coded status indicators for quick scanning
- **Confirmation Dialogs**: Prevent accidental order cancellations
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Clear feedback during API operations

## 🎁 Bonus Features

### ✅ Implemented Bonus Features

1. **Advanced Filtering System**:
   - Frontend filter buttons with accurate order counts per user
   - Backend query parameter support for status and user filtering
   - Combined filtering (status + user) with proper API endpoints
   - Smart count calculation that updates based on selected filters

2. **User Management & Filtering**:
   - 3 pre-loaded sample users: Alice Smith, Bob Johnson, Charlie Brown
   - User-specific order filtering with `/api/orders/users` endpoint
   - Proper user display formatting (alice.smith → Alice Smith)
   - Real-time filter count updates

3. **Enhanced Order Data Model**:
   - **Quantity Field**: Each order includes quantity information
   - **UUID Generation**: Proper UUID v4 generation for all order IDs
   - Enhanced order validation with quantity requirements
   - Updated TypeScript interfaces across frontend and backend

4. **Professional UI/UX Design**:
   - **Modern CSS Framework**: Custom professional styling system
   - **Card-based Layout**: Clean, modern order cards with proper spacing
   - **Status Badges**: Color-coded status indicators (pending, completed, cancelled)
   - **Responsive Design**: Mobile-first approach with proper breakpoints
   - **Loading States**: Professional loading spinners and error states

5. **Local Persistence & Caching**:
   - Browser localStorage caching for offline functionality
   - Automatic fallback when API is unavailable
   - Cache management utilities with proper sync

6. **Comprehensive Testing**:
   - Unit test suite for OrderService with quantity field support
   - Jest configuration and test scripts
   - Coverage for all CRUD operations and filtering

7. **Enhanced Error Handling**:
   - Graceful API failure handling with user-friendly messages
   - Proper HTTP status codes and error responses
   - Retry mechanisms and fallback states

8. **Advanced Architecture**:
   - TypeScript end-to-end with shared interfaces
   - Custom React hooks for state management
   - Service layer separation for API logic
   - Middleware for validation and error handling

## 🧪 Testing

### Backend Tests

Run unit tests:
```bash
cd backend
npm test
```

Run tests with coverage:
```bash
cd backend
npm test -- --coverage
```

### Test Coverage

The test suite covers:
- Order creation with proper validation
- Order retrieval and filtering
- Status updates and validation
- Order deletion
- Error handling scenarios

## 📝 Assumptions

### Business Logic
1. **Order Status Flow**: Orders can transition between any status (pending → completed/cancelled)
2. **Cancellation Rules**: Only pending orders can be cancelled via the UI
3. **Data Persistence**: In-memory storage is acceptable for this demo
4. **User Authentication**: No authentication required; userId is part of order data

### Technical Assumptions
1. **Browser Support**: Modern browsers with localStorage support
2. **API Availability**: Frontend should handle API downtime gracefully
3. **Data Volume**: Reasonable number of orders (< 1000) for in-memory storage
4. **Concurrent Users**: Single-user application (no real-time sync needed)

### Sample Data
- **6 Pre-loaded Orders**: Distributed across 3 users with realistic data
- **3 Sample Users**:
  - `alice.smith` (Alice Smith) - 2 orders (2 pending)
  - `bob.johnson` (Bob Johnson) - 2 orders (1 pending, 1 completed)
  - `charlie.brown` (Charlie Brown) - 2 orders (1 cancelled, 1 pending)
- **Realistic Products**: Wireless Headphones, Gaming Mouse, Smartphone, etc.
- **Quantity Variety**: Orders range from 1-3 items per order
- **Mixed Statuses**: Balanced distribution of pending, completed, and cancelled orders
- **Proper Pricing**: Realistic amounts from $89.99 to $1,299.99

## 🔧 Development Scripts

### Root Level
- `npm run dev` - Start both backend and frontend
- `npm run install:all` - Install dependencies for both projects
- `npm run backend:dev` - Start only backend
- `npm run frontend:dev` - Start only frontend

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run unit tests

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests (React testing setup)

## 🚀 Production Deployment

For production deployment:

1. **Backend**: Build and serve the compiled JavaScript
2. **Frontend**: Build static assets and serve via web server
3. **Environment Variables**: Set `REACT_APP_API_URL` for frontend
4. **CORS**: Update CORS settings for production domains

## 📞 Support

For questions or issues:
- Check the console for detailed error messages
- Verify both backend and frontend are running
- Clear localStorage if experiencing data issues
- Review API endpoints in browser Network tab
