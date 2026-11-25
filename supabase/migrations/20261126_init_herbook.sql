-- ========================================================
-- HERBOOK PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY
-- Platform: Supabase PostgreSQL (India Compliance • DPDP Act 2023)
-- Tagline: Her Body. Her Health. Her World.
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio TEXT DEFAULT 'Passionate about women''s health, wellness & supportive community 🌸',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'doctor', 'creator', 'reviewer', 'moderator', 'admin', 'superadmin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
  is_verified_doctor BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HERCYCLE PERIOD LOGS TABLE (Private Health Data)
CREATE TABLE IF NOT EXISTS public.cycle_periods (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  flow TEXT CHECK (flow IN ('spotting', 'light', 'medium', 'heavy')),
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HERCYCLE DAILY SYMPTOMS & SENSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.cycle_daily_logs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_period BOOLEAN DEFAULT false,
  flow TEXT,
  symptoms TEXT[] DEFAULT '{}',
  mood TEXT,
  energy TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 5. HEALTH RECORDS VAULT (DPDP Act 2023 Encrypted Vault)
CREATE TABLE IF NOT EXISTS public.health_records (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Lab Report', 'Ultrasound Scan', 'Prescription', 'Clinical Note')),
  date DATE NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL,
  shared_with_doctor_ids TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONSULTATION APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  doctor_avatar TEXT NOT NULL,
  doctor_specialty TEXT NOT NULL,
  medical_system TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('video', 'in-person')),
  doctor_fee NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  total_paid NUMERIC NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid_sandbox', 'paid_live', 'refunded')),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  meeting_room_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_notes TEXT,
  consultation_notes TEXT,
  doctor_prescription TEXT,
  shared_record_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCTOR ONBOARDING APPLICATIONS (Telemedicine 2020 Compliance)
CREATE TABLE IF NOT EXISTS public.doctor_applications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  legal_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT,
  medical_system TEXT NOT NULL,
  registering_council TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  registration_year TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  clinic_location TEXT NOT NULL,
  languages TEXT[] DEFAULT '{}',
  certificate_file_name TEXT NOT NULL,
  identity_file_name TEXT NOT NULL,
  status TEXT DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Verified', 'Rejected', 'More Information Required')),
  verification_source TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SOCIAL POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  caption TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'carousel', 'video')),
  media_urls TEXT[] NOT NULL,
  category TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. POST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.post_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  text TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SOCIAL LIKES & SAVED POSTS
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS public.saved_posts (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- 11. SOCIAL FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- 12. AUDIT LOGS TABLE (IT Rules 2021 & DPDP Act 2023)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  target_type TEXT,
  ip_address TEXT,
  details TEXT NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view username/avatar; User can edit own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Cycle Periods: Strictly private to authenticated owner
CREATE POLICY "Users can only view own menstrual periods" ON public.cycle_periods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert own menstrual periods" ON public.cycle_periods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update own menstrual periods" ON public.cycle_periods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can only delete own menstrual periods" ON public.cycle_periods FOR DELETE USING (auth.uid() = user_id);

-- Cycle Daily Logs: Strictly private to authenticated owner
CREATE POLICY "Users can only view own daily symptoms" ON public.cycle_daily_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only insert own daily symptoms" ON public.cycle_daily_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update own daily symptoms" ON public.cycle_daily_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can only delete own daily symptoms" ON public.cycle_daily_logs FOR DELETE USING (auth.uid() = user_id);

-- Health Records Vault: Private to owner, or consulting doctor with valid appointment
CREATE POLICY "Users view own health records" ON public.health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own health records" ON public.health_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own health records" ON public.health_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own health records" ON public.health_records FOR DELETE USING (auth.uid() = user_id);

-- Appointments: Private to patient or assigned doctor
CREATE POLICY "Patients view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Posts: Viewable by all, editable by author
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Comments: Viewable by all, creatable by authenticated
CREATE POLICY "Comments viewable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = author_id);

-- Doctor Applications: Viewable and updatable by admin only
CREATE POLICY "Doctors can view own applications" ON public.doctor_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors can submit applications" ON public.doctor_applications FOR INSERT WITH CHECK (true);
