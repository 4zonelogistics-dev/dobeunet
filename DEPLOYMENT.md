# Production Deployment Guide

## Overview
This guide covers deploying the Dobeu Tech Solutions application with Apollo form enrichment integration and Supabase database.

## Prerequisites
- Node.js 18+ installed
- Supabase account with project created
- Apollo.io account with Inbound app configured
- Hosting platform account (Vercel, Netlify, or similar)

## Database Setup

### 1. Supabase Configuration
Your Supabase database is ready for production with:
- ✅ All tables created with proper schema
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Production-optimized indexes for fast queries
- ✅ Admin and user role-based access control
- ✅ Analytics and tracking tables configured

### 2. Environment Variables
Ensure these environment variables are set in your production environment:

```bash
VITE_SUPABASE_URL=https://bdybvndjajomdnjtrajs.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Never commit the `.env` file to version control. These values are already configured in your current deployment.

## Apollo Form Enrichment

### 1. Verification
Apollo Inbound script is integrated and configured with:
- App ID: `68fcdf9e32f1ab0021599b24`
- Automatic initialization on page load
- Error handling and fallback support
- Console logging for debugging

### 2. Form Configuration
The following forms are configured for Apollo enrichment:
- **Contact Form** (`#contact-email`)
- **Newsletter Subscription** (`#newsletter-email`)
- **Booking System** (`#booking-email`)

### 3. Testing Apollo Integration
To verify Apollo is working:
1. Open browser console
2. Look for: "Apollo Inbound form enrichment initialized successfully"
3. Fill out a form with a business email address
4. Check the `analytics_events` table for enrichment tracking

## Deployment Steps

### Option 1: Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Option 2: Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to production
netlify deploy --prod

# Configure environment variables in Netlify dashboard
# Navigate to: Site settings > Environment variables
```

### Option 3: Manual Build & Deploy
```bash
# Build the application
npm run build

# Upload the 'dist' folder to your hosting provider
# Ensure the hosting provider is configured for SPA routing
```

## Post-Deployment Checklist

### 1. Verify Core Functionality
- [ ] Homepage loads correctly
- [ ] All forms submit successfully
- [ ] Newsletter subscription works
- [ ] Booking system is functional
- [ ] Contact form sends messages

### 2. Verify Apollo Enrichment
- [ ] Apollo script loads without errors
- [ ] Console shows initialization message
- [ ] Test form submission with business email
- [ ] Check `analytics_events` table for tracking data

### 3. Verify Database Operations
- [ ] Forms save data to Supabase
- [ ] RLS policies prevent unauthorized access
- [ ] Admin dashboard can access all data
- [ ] Analytics events are being tracked

### 4. Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Forms submit within 2 seconds
- [ ] No console errors on any page
- [ ] All images and assets load correctly

## Database Tables

### Production Tables
1. **profiles** - User profile information
2. **newsletter_subscribers** - Newsletter email list
3. **bookings** - Consultation booking requests
4. **contact_submissions** - Contact form submissions (Apollo target)
5. **analytics_events** - Event tracking including Apollo enrichment
6. **page_views** - Page visit analytics
7. **user_sessions** - User session tracking
8. **premium_messages** - Premium user messaging
9. **calendar_settings** - Admin calendar configuration
10. **user_roles** - Role-based access control
11. **direct_messages** - Direct user messaging

### Indexed Columns
For optimal query performance, the following columns are indexed:
- Email addresses (all tables with email fields)
- Status fields (bookings, contact_submissions, premium_messages)
- Date fields (created_at, subscribed_at, preferred_date)
- Session IDs and user IDs
- Composite indexes for common admin queries

## Monitoring & Analytics

### Apollo Enrichment Tracking
Apollo enrichment events are tracked in `analytics_events` with:
- Event name: `apollo_form_enrichment`
- Email address
- Form type (contact, newsletter, booking)
- Success/failure status
- Enriched data (when available)
- Timestamp

### Query Analytics Data
```sql
-- View Apollo enrichment success rate
SELECT
  event_data->>'form_type' as form_type,
  COUNT(*) as total_events,
  SUM(CASE WHEN event_data->>'success' = 'true' THEN 1 ELSE 0 END) as successful,
  ROUND(AVG(CASE WHEN event_data->>'success' = 'true' THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
FROM analytics_events
WHERE event_name = 'apollo_form_enrichment'
GROUP BY event_data->>'form_type';

-- View recent form submissions
SELECT * FROM contact_submissions
ORDER BY created_at DESC
LIMIT 20;

-- View newsletter subscribers
SELECT * FROM newsletter_subscribers
ORDER BY subscribed_at DESC
LIMIT 20;

-- View booking requests
SELECT * FROM bookings
WHERE status = 'pending'
ORDER BY created_at DESC;
```

## Troubleshooting

### Apollo Script Not Loading
1. Check browser console for errors
2. Verify Apollo app ID is correct
3. Check network tab for script request
4. Ensure no ad blockers are interfering

### Forms Not Submitting
1. Check browser console for errors
2. Verify Supabase environment variables
3. Check RLS policies in Supabase dashboard
4. Test database connection with simple query

### Database Connection Issues
1. Verify environment variables are set correctly
2. Check Supabase project is active (not paused)
3. Verify anon key has correct permissions
4. Check network connectivity

## Security Considerations

### Row Level Security (RLS)
All tables have RLS enabled with proper policies:
- Public forms (contact, newsletter, booking) allow anonymous inserts
- User data is restricted to authenticated users
- Admin data requires admin role verification
- No table allows unrestricted public access

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate keys periodically
- Monitor for unauthorized access

### API Keys
- Anon key is safe for public use (limited permissions)
- Service role key should NEVER be exposed to frontend
- Apollo app ID is safe for public use

## Support & Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [Apollo.io Inbound Documentation](https://www.apollo.io/docs)
- [Vite Documentation](https://vitejs.dev/)

### Supabase Dashboard
Access your database at: https://supabase.com/dashboard/project/bdybvndjajomdnjtrajs

### Apollo Dashboard
Manage your Apollo integration at: https://app.apollo.io/

## Maintenance

### Regular Tasks
- Monitor Apollo enrichment success rates weekly
- Review contact submissions and respond within 24 hours
- Check booking requests daily
- Monitor database usage and storage
- Update dependencies monthly
- Review and optimize slow queries quarterly

### Backup Strategy
Supabase automatically backs up your database:
- Point-in-time recovery available
- Daily backups retained for 7 days
- Enable additional backup retention in Supabase dashboard if needed

### Scaling Considerations
As traffic grows, consider:
- Implementing database connection pooling
- Adding CDN for static assets
- Optimizing large database queries
- Implementing caching strategies
- Monitoring and alerting setup
