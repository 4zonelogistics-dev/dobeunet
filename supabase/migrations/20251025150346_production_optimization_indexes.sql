/*
  # Production Optimization - Database Indexes
  
  1. Purpose
    - Add indexes for frequently queried columns
    - Improve query performance for production workloads
    - Optimize form submission and analytics queries
  
  2. Indexes Added
    - Email lookups (contact_submissions, newsletter_subscribers, bookings)
    - Status filters (bookings, contact_submissions, premium_messages)
    - Date-based queries (created_at columns)
    - Session tracking (session_id, user_id)
    - Analytics queries (event_name, page_url)
  
  3. Performance Impact
    - Faster email-based searches for Apollo enrichment data
    - Improved admin dashboard query performance
    - Optimized analytics and reporting queries
*/

-- Indexes for contact_submissions (Apollo enrichment target)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Indexes for newsletter_subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmed ON public.newsletter_subscribers(confirmed);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_consultation_type ON public.bookings(consultation_type);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON public.bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Indexes for page_views
CREATE INDEX IF NOT EXISTS idx_page_views_url ON public.page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON public.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);

-- Indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON public.user_sessions(started_at DESC);

-- Indexes for premium_messages
CREATE INDEX IF NOT EXISTS idx_premium_messages_user ON public.premium_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_messages_status ON public.premium_messages(status);
CREATE INDEX IF NOT EXISTS idx_premium_messages_priority ON public.premium_messages(priority);
CREATE INDEX IF NOT EXISTS idx_premium_messages_created_at ON public.premium_messages(created_at DESC);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);

-- Indexes for user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Composite indexes for common admin queries
CREATE INDEX IF NOT EXISTS idx_bookings_status_created ON public.bookings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status_created ON public.contact_submissions(status, created_at DESC);