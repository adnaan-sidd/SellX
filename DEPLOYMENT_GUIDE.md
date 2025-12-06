# 🚀 SellX Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] `.env` file created from `.env.example` template
- [ ] All required environment variables configured
- [ ] Database connection tested and accessible
- [ ] Redis connection configured (optional but recommended)
- [ ] AWS S3 bucket created and permissions configured
- [ ] Razorpay account set up with live credentials
- [ ] SendGrid account configured for email delivery
- [ ] Twilio account configured for SMS delivery

### ✅ Security Configuration
- [ ] SSL certificate obtained and configured
- [ ] HTTPS enforced on all connections
- [ ] Security headers properly configured
- [ ] CORS settings configured for production domain
- [ ] Rate limiting rules tested
- [ ] CSRF protection enabled
- [ ] Input validation and sanitization verified

### ✅ Database Setup
- [ ] Prisma migrations run successfully
- [ ] Database indexes created for performance
- [ ] Initial seed data populated (categories, admin user)
- [ ] Database backup procedures configured
- [ ] Connection pooling configured
- [ ] Database monitoring set up

### ✅ External Services
- [ ] Razorpay webhooks configured and tested
- [ ] SendGrid templates created and IDs configured
- [ ] Twilio SMS service tested
- [ ] AWS S3 bucket policies configured
- [ ] CDN (CloudFront) configured for static assets

### ✅ Application Testing
- [ ] Unit tests passing (Jest)
- [ ] Integration tests passing
- [ ] E2E tests passing (Playwright)
- [ ] Load testing completed (Artillery/k6)
- [ ] Security testing completed (OWASP ZAP)
- [ ] Performance benchmarks established

## 🚀 Deployment Steps

### 1. Database Deployment

#### Option A: Railway (Recommended for simplicity)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init sellx-backend

# Set environment variables
railway variables set DATABASE_URL="postgresql://..."
railway variables set NEXTAUTH_SECRET="..."
# ... set all required variables

# Deploy
railway up
```

#### Option B: Supabase
```bash
# Create Supabase project
npx supabase init
npx supabase start

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

#### Option C: AWS RDS
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier sellx-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username sellx_admin \
  --master-user-password "secure-password" \
  --allocated-storage 20

# Run migrations after DB is ready
npx prisma migrate deploy
```

### 2. Vercel Deployment

#### Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (leave default)

#### Environment Variables
Set all environment variables in Vercel dashboard:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=sellx-uploads
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@sellx.com
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+91...
REDIS_URL=redis://...
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_SENTRY_DSN=...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to be issued

### 3. CDN Setup (AWS CloudFront)

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# Example cloudfront-config.json
{
  "CallerReference": "sellx-cdn-$(date +%s)",
  "Comment": "SellX CDN Distribution",
  "DefaultCacheBehavior": {
    "TargetOriginId": "sellx-s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "sellx-s3-origin",
        "DomainName": "sellx-uploads.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true
}
```

### 4. Monitoring Setup

#### Sentry Configuration
1. Create Sentry project at [sentry.io](https://sentry.io)
2. Get DSN and add to environment variables
3. Configure release tracking in Vercel

#### Uptime Monitoring (UptimeRobot)
1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add monitors for:
   - Main application: `https://your-domain.com`
   - API health check: `https://your-domain.com/api/health`
   - Database connectivity check

### 5. Email Configuration

#### SendGrid Setup
```bash
# Create dynamic templates in SendGrid dashboard
# Get template IDs and update environment variables

# Test email delivery
curl -X POST \
  https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{
      "to": [{"email": "test@example.com"}],
      "subject": "Test Email"
    }],
    "from": {"email": "noreply@sellx.com"},
    "content": [{"type": "text/plain", "value": "Test email from SellX"}]
  }'
```

## 🔄 Post-Deployment Verification

### ✅ Functional Testing
- [ ] User registration and login working
- [ ] Product listing creation working
- [ ] Payment processing working
- [ ] Email notifications working
- [ ] SMS OTP delivery working
- [ ] Image uploads working
- [ ] Search and filtering working

### ✅ Performance Testing
- [ ] Page load times under 3 seconds
- [ ] API response times under 500ms
- [ ] Image loading optimized
- [ ] Database queries optimized
- [ ] CDN serving static assets

### ✅ Security Verification
- [ ] HTTPS enabled on all pages
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] CSRF protection active
- [ ] Input validation working
- [ ] No sensitive data in logs

### ✅ SEO Verification
- [ ] Meta tags present on pages
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Structured data valid
- [ ] Open Graph tags working

## 🚨 Rollback Plan

### Immediate Rollback (0-5 minutes)
If critical issues are detected immediately after deployment:

1. **Vercel Rollback**
   ```bash
   # Via Vercel CLI
   vercel rollback

   # Or via dashboard: Deployments → Rollback
   ```

2. **Database Rollback**
   ```bash
   # If migration caused issues
   npx prisma migrate reset --force

   # Or restore from backup
   pg_restore -h your-db-host -U username -d sellx_db backup.sql
   ```

### Delayed Rollback (5-60 minutes)
For issues discovered after some traffic:

1. **Feature Flags**
   - Use feature flags to disable problematic features
   - Gradually roll back by disabling flags

2. **Blue-Green Deployment**
   - Keep previous version running
   - Route traffic back to stable version
   - Monitor and gradually migrate back

### Extended Rollback (>1 hour)
For major issues requiring full rollback:

1. **Complete Revert**
   ```bash
   # Git revert to previous commit
   git revert HEAD~1
   git push origin main

   # Vercel will auto-deploy the revert
   ```

2. **Database Migration Revert**
   ```bash
   # Create down migration
   npx prisma migrate dev --create-only

   # Apply down migration
   npx prisma migrate deploy
   ```

## 📊 Monitoring & Alerting

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Real user monitoring
- **Google Analytics**: User behavior tracking

### Infrastructure Monitoring
- **UptimeRobot**: Website uptime monitoring
- **AWS CloudWatch**: Infrastructure metrics
- **Database monitoring**: Query performance and connections

### Business Monitoring
- **Payment monitoring**: Transaction success rates
- **User engagement**: Signups, listings, conversions
- **Error rates**: API failures, user-reported issues

## 🔧 Maintenance Procedures

### Regular Maintenance
- **Daily**: Check error logs and alerts
- **Weekly**: Review performance metrics
- **Monthly**: Security updates and dependency checks
- **Quarterly**: Full security audit and penetration testing

### Emergency Procedures
1. **Critical Issue Response**
   - Assess impact and urgency
   - Notify stakeholders
   - Implement fix or rollback
   - Communicate with users

2. **Data Breach Response**
   - Isolate affected systems
   - Assess data exposure
   - Notify affected users
   - Report to authorities if required

## 📞 Support Contacts

### Technical Support
- **DevOps Team**: devops@sellx.com
- **Security Team**: security@sellx.com
- **Database Admin**: dba@sellx.com

### Business Support
- **Customer Support**: support@sellx.com
- **Business Team**: business@sellx.com

### Emergency Contacts
- **Primary**: +91-XXXXXXXXXX (24/7)
- **Secondary**: +91-XXXXXXXXXX

## 📝 Change Log

| Date | Version | Changes | Deployed By |
|------|---------|---------|-------------|
| YYYY-MM-DD | v1.0.0 | Initial production deployment | [Name] |

---

## ✅ Final Checklist

- [ ] All pre-deployment checks completed
- [ ] Database deployed and migrated
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] CDN configured
- [ ] Monitoring tools active
- [ ] Email/SMS services tested
- [ ] Functional testing passed
- [ ] Performance benchmarks met
- [ ] Security verification completed
- [ ] Rollback procedures documented
- [ ] Support contacts updated
- [ ] Go-live announcement ready

**Deployment Commander**: ____________________
**Date**: ____________________
**Time**: ____________________