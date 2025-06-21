
-- Create enums for different types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('user', 'talent', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE talent_level AS ENUM ('fresh', 'elite', 'vip');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('chat', 'call', 'video_call', 'offline_date', 'party_buddy', 'rent_lover');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table to include talent-specific fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS talent_level talent_level DEFAULT 'fresh';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zodiac TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS love_language TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS party_buddy_eligible BOOLEAN DEFAULT false;

-- Create verification documents table
CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'ktp', 'selfie', etc.
    document_url TEXT NOT NULL,
    status verification_status DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create talent services table
CREATE TABLE IF NOT EXISTS talent_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    service_type service_type NOT NULL,
    is_available BOOLEAN DEFAULT true,
    custom_rate INTEGER, -- for rent_lover custom pricing
    description TEXT,
    max_duration INTEGER, -- in minutes for calls
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create talent interests table
CREATE TABLE IF NOT EXISTS talent_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    interest TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    service_type service_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service rates table for standard pricing
CREATE TABLE IF NOT EXISTS service_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type service_type NOT NULL UNIQUE,
    base_rate INTEGER NOT NULL, -- in IDR
    additional_rate INTEGER, -- for overtime
    unit TEXT NOT NULL, -- 'per_day', 'per_hour', 'per_event'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard service rates
INSERT INTO service_rates (service_type, base_rate, unit) VALUES
('chat', 25000, 'per_day'),
('call', 40000, 'per_hour'),
('video_call', 65000, 'per_hour'),
('offline_date', 285000, 'per_3_hours'),
('party_buddy', 1000000, 'per_event')
ON CONFLICT (service_type) DO NOTHING;

-- Update bookings table structure
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_type service_type;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS date_plan TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transport_fee INTEGER DEFAULT 0;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create commission rates table
CREATE TABLE IF NOT EXISTS commission_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_level talent_level NOT NULL UNIQUE,
    commission_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert commission rates
INSERT INTO commission_rates (talent_level, commission_percentage) VALUES
('fresh', 20.00),
('elite', 18.00),
('vip', 15.00)
ON CONFLICT (talent_level) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for verification_documents
DROP POLICY IF EXISTS "Users can view their own verification documents" ON verification_documents;
CREATE POLICY "Users can view their own verification documents" ON verification_documents
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own verification documents" ON verification_documents;
CREATE POLICY "Users can insert their own verification documents" ON verification_documents
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for talent_services
DROP POLICY IF EXISTS "Anyone can view talent services" ON talent_services;
CREATE POLICY "Anyone can view talent services" ON talent_services
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Talents can manage their own services" ON talent_services;
CREATE POLICY "Talents can manage their own services" ON talent_services
    FOR ALL USING (talent_id = auth.uid());

-- Create RLS policies for talent_interests
DROP POLICY IF EXISTS "Anyone can view talent interests" ON talent_interests;
CREATE POLICY "Anyone can view talent interests" ON talent_interests
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Talents can manage their own interests" ON talent_interests;
CREATE POLICY "Talents can manage their own interests" ON talent_interests
    FOR ALL USING (talent_id = auth.uid());

-- Create RLS policies for availability_slots
DROP POLICY IF EXISTS "Anyone can view availability slots" ON availability_slots;
CREATE POLICY "Anyone can view availability slots" ON availability_slots
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Talents can manage their own availability" ON availability_slots;
CREATE POLICY "Talents can manage their own availability" ON availability_slots
    FOR ALL USING (talent_id = auth.uid());

-- Create RLS policies for service_rates
DROP POLICY IF EXISTS "Anyone can view service rates" ON service_rates;
CREATE POLICY "Anyone can view service rates" ON service_rates
    FOR SELECT USING (true);

-- Create RLS policies for reviews
DROP POLICY IF EXISTS "Anyone can view verified reviews" ON reviews;
CREATE POLICY "Anyone can view verified reviews" ON reviews
    FOR SELECT USING (is_verified = true);

DROP POLICY IF EXISTS "Users can create reviews for their bookings" ON reviews;
CREATE POLICY "Users can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Create RLS policies for commission_rates
DROP POLICY IF EXISTS "Anyone can view commission rates" ON commission_rates;
CREATE POLICY "Anyone can view commission rates" ON commission_rates
    FOR SELECT USING (true);

-- Create function to update talent level based on orders and ratings
CREATE OR REPLACE FUNCTION update_talent_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Update talent level to elite if conditions are met
    UPDATE profiles 
    SET talent_level = 'elite'
    WHERE id = NEW.companion_id 
    AND talent_level = 'fresh'
    AND total_bookings >= 30
    AND rating >= 4.5;

    -- Update talent level to vip if conditions are met
    UPDATE profiles 
    SET talent_level = 'vip'
    WHERE id = NEW.companion_id 
    AND talent_level = 'elite'
    AND total_bookings >= 100
    AND rating >= 4.5
    AND created_at <= NOW() - INTERVAL '6 months';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update talent level after booking completion
DROP TRIGGER IF EXISTS update_talent_level_trigger ON bookings;
CREATE TRIGGER update_talent_level_trigger
    AFTER UPDATE ON bookings
    FOR EACH ROW
    WHEN (NEW.booking_status = 'completed')
    EXECUTE FUNCTION update_talent_level();
