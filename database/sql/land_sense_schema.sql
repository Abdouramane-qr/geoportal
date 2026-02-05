-- Laravel-adapted schema (PostgreSQL)
-- Assumes public.users exists (Laravel default) and uses BIGINT user IDs.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'agronome' CHECK (role IN ('agronome', 'admin', 'autorite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Validation records table
CREATE TABLE IF NOT EXISTS public.validation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id TEXT NOT NULL,
  parcel_name TEXT NOT NULL,
  original_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'import' CHECK (current_step IN ('import', 'detection', 'correction', 'validation')),
  step_status JSONB NOT NULL DEFAULT '{"import": "pending", "detection": "pending", "correction": "pending", "validation": "pending"}',
  validated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Validation errors table
CREATE TABLE IF NOT EXISTS public.validation_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_record_id UUID REFERENCES public.validation_records(id) ON DELETE CASCADE NOT NULL,
  field TEXT NOT NULL,
  value TEXT NOT NULL,
  rule TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'error' CHECK (severity IN ('error', 'warning')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Validation corrections table
CREATE TABLE IF NOT EXISTS public.validation_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  validation_record_id UUID REFERENCES public.validation_records(id) ON DELETE CASCADE NOT NULL,
  field TEXT NOT NULL,
  original_value TEXT NOT NULL,
  proposed_value TEXT NOT NULL,
  reason TEXT NOT NULL,
  accepted BOOLEAN DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_validation_records_updated_at ON public.validation_records;
CREATE TRIGGER update_validation_records_updated_at
BEFORE UPDATE ON public.validation_records
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_validation_corrections_updated_at ON public.validation_corrections;
CREATE TRIGGER update_validation_corrections_updated_at
BEFORE UPDATE ON public.validation_corrections
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
