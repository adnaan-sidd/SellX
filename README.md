# 🚀 SellX - Online Marketplace

SellX is a modern, secure online marketplace built with Next.js 14, TypeScript, and PostgreSQL. It enables users to buy and sell products with integrated payment processing, real-time chat, and comprehensive seller verification.

![SellX](https://img.shields.io/badge/SellX-v1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🛒 Core Marketplace Features
- **Product Listings**: Multi-step product creation with image uploads
- **Advanced Search**: Filter by category, price, location, and condition
- **Real-time Chat**: Integrated messaging between buyers and sellers
- **Favorites System**: Save products for later
- **Product Reviews**: Rate and review transactions

### 💳 Payment & Security
- **Razorpay Integration**: Secure payment processing
- **₹25 Listing Fee**: One-time payment for product listings
- **Payment Verification**: Automatic receipt generation
- **Fraud Detection**: Advanced fraud reporting system

### 🔐 User Management
- **OTP Authentication**: Phone number verification
- **Seller Verification**: Government ID and business verification
- **Buyer Verification**: Identity verification for chat access
- **Role-based Access**: Separate permissions for buyers and sellers

### 📊 Analytics & Monitoring
- **Google Analytics**: User behavior tracking
- **Sentry Integration**: Error monitoring and performance tracking
- **Admin Dashboard**: Comprehensive analytics and moderation tools

### 📱 Modern UX
- **Responsive Design**: Mobile-first approach
- **Image Optimization**: Next.js Image component with WebP support
- **Lazy Loading**: Code splitting and dynamic imports
- **SEO Optimized**: Meta tags, sitemap, and structured data

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **SWR** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM with type safety
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage

### External Services
- **Razorpay** - Payment processing
- **AWS S3** - File storage
- **SendGrid** - Email delivery
- **Twilio** - SMS services
- **Sentry** - Error monitoring

### Development Tools
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **PostgreSQL 15+**
- **Redis** (optional, for caching)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sellx.git
   cd sellx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
sellx/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── cache.ts           # Caching system
│   │   ├── email.ts           # Email service
│   │   ├── prisma.ts          # Database client
│   │   ├── razorpay.ts        # Payment integration
│   │   ├── s3.ts              # File storage
│   │   ├── seo.ts             # SEO utilities
│   │   ├── sentry.ts          # Error monitoring
│   │   └── validations.ts     # Input validation
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Next.js middleware
├── prisma/                    # Database schema and migrations
├── e2e/                       # End-to-end tests
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── jest.config.js             # Jest configuration
├── playwright.config.ts       # Playwright configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all required environment variables. Key configurations:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sellx"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateway
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-secret"

# File Storage
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET_NAME="sellx-uploads"

# Email Service
SENDGRID_API_KEY="SG..."
FROM_EMAIL="noreply@sellx.com"

# SMS Service
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+91..."

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-..."
NEXT_PUBLIC_SENTRY_DSN="https://..."
```

### Database Schema

The application uses Prisma with PostgreSQL. Key models:

- **User**: User accounts with roles and verification status
- **Product**: Product listings with images and metadata
- **Payment**: Payment transactions and records
- **Chat**: Real-time messaging between users
- **FraudReport**: User-reported fraudulent activities
- **SupportTicket**: Customer support system

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### All Tests
```bash
npm test
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Vercel will auto-detect Next.js
   vercel --prod
   ```

2. **Environment Variables**
   - Set all variables from `.env` in Vercel dashboard
   - Configure custom domain

3. **Database**
   - Use Railway, Supabase, or AWS RDS
   - Run `npx prisma migrate deploy`

### Manual Deployment

See `DEPLOYMENT_GUIDE.md` for comprehensive deployment instructions.

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/send-otp`
Send OTP to phone number for authentication.

**Request:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and create/login user.

**Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

### Product Endpoints

#### GET `/api/products/list`
Get paginated list of products with filters.

**Query Parameters:**
- `search`: Search term
- `category`: Category filter
- `minPrice`, `maxPrice`: Price range
- `city`: Location filter
- `page`: Page number
- `sort`: Sort order (newest, price_asc, price_desc)

#### POST `/api/products/create`
Create a new product listing.

**Request (FormData):**
```
title: "iPhone 12 Pro"
description: "Excellent condition..."
price: "45000"
condition: "Used"
category: "Electronics"
subcategory: "Mobiles"
city: "Mumbai"
state: "Maharashtra"
pincode: "400001"
images: [File, File, ...]
```

### Payment Endpoints

#### POST `/api/payment/create-order`
Create Razorpay order for payment.

**Request:**
```json
{
  "amount": 25
}
```

#### POST `/api/payment/verify`
Verify payment and create product listing.

**Request:**
```json
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "...",
  "productData": { ... }
}
```

## 🔒 Security

SellX implements comprehensive security measures:

- **Authentication**: OTP-based phone verification
- **Authorization**: Role-based access control
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API rate limiting with Redis
- **CSRF Protection**: Token-based CSRF prevention
- **XSS Prevention**: HTML sanitization
- **SQL Injection Prevention**: Parameterized queries
- **File Upload Security**: Type and size validation
- **HTTPS Enforcement**: SSL/TLS encryption
- **Security Headers**: Comprehensive HTTP headers

See `SECURITY_AUDIT_CHECKLIST.md` for detailed security implementation.

## 📊 Monitoring

### Error Monitoring
- **Sentry**: Real-time error tracking and alerting
- **Performance Monitoring**: API response times and database queries

### Analytics
- **Google Analytics 4**: User behavior and conversion tracking
- **Custom Events**: Product views, payments, user engagement

### Uptime Monitoring
- **UptimeRobot**: Website availability monitoring
- **Health Checks**: API endpoint monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Code Style**: ESLint and Prettier configured
- **Testing**: Write tests for new features
- **Documentation**: Update docs for API changes
- **Security**: Follow security best practices
- **Performance**: Optimize for speed and efficiency

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@sellx.com
- **Documentation**: [docs.sellx.com](https://docs.sellx.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/sellx/issues)

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **Prisma** for the database toolkit
- **Tailwind CSS** for the styling framework
- **Razorpay** for payment processing
- **SendGrid** for email delivery

---

**Built with ❤️ for India's marketplace revolution**
